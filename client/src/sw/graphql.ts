import type {
  GetWordQueryVariables,
  GetWordsQueryVariables,
  GetPropertiesQueryVariables,
  GetLanguagesQuery,
  GetPropertiesQuery,
  WordFieldsFragment,
  GetWordsQuery,
  GetWordQuery,
} from '../api/types/graphql';
import { SyncStatus, getSyncStatus } from './sync';
import * as cache from './cache';

type GraphQlRequest<TVariables = Record<string, unknown>> = {
  operationName: string;
  variables: TVariables;
};

enum GraphQlQueryPolicy {
  NetworkOnly = 'NetworkOnly',
  NetworkFirst = 'NetworkFirst',
  CacheFirst = 'CacheFirst',
}

enum GraphQlQuery {
  GetLanguages = 'GetLanguages',
  GetProperties = 'GetProperties',
  GetWords = 'GetWords',
  GetWord = 'GetWord',
}

enum GraphQlMutation {
  CreateLanguage = 'CreateLanguage',
  UpdateLanguage = 'UpdateLanguage',
  DeleteLanguage = 'DeleteLanguage',
  CreateProperty = 'CreateProperty',
  UpdateProperty = 'UpdateProperty',
  DeleteProperty = 'DeleteProperty',
  ReorderProperties = 'ReorderProperties',
  CreateWord = 'CreateWord',
  UpdateWord = 'UpdateWord',
  DeleteWord = 'DeleteWord',
}

export function isGraphQlRequest(request: Request): boolean {
  return new URL(request.url).pathname === '/api/graphql';
}

export async function handleGraphQlRequest(
  event: FetchEvent,
): Promise<Response> {
  const request = await getGraphQlRequest(event);
  if (isGraphQlQuery(request)) {
    return handleGraphQlQuery(event, request);
  } else if (isGraphQlMutation(request)) {
    return handleGraphQlMutation(event, request);
  } else {
    return fetch(event.request);
  }
}

function getGraphQlQueryPolicy(request: GraphQlRequest): GraphQlQueryPolicy {
  switch (request.operationName) {
    case GraphQlQuery.GetLanguages:
      return GraphQlQueryPolicy.CacheFirst;
    case GraphQlQuery.GetProperties:
      return GraphQlQueryPolicy.CacheFirst;
    case GraphQlQuery.GetWord:
      return GraphQlQueryPolicy.CacheFirst;
    case GraphQlQuery.GetWords: {
      const { query, order } = request.variables as GetWordsQueryVariables;
      if (query) {
        return GraphQlQueryPolicy.NetworkFirst;
      } else if (order && order !== 'Chronological') {
        return GraphQlQueryPolicy.NetworkOnly;
      } else {
        return GraphQlQueryPolicy.CacheFirst;
      }
    }
    default:
      return GraphQlQueryPolicy.NetworkOnly;
  }
}

async function handleGraphQlQuery(
  event: FetchEvent,
  request: GraphQlRequest,
): Promise<Response> {
  const policy = getGraphQlQueryPolicy(request);
  const syncStatus = await getSyncStatus();

  if (policy === GraphQlQueryPolicy.NetworkFirst) {
    return handleGraphQlQueryNetworkFirst(event, syncStatus, request);
  } else if (
    policy === GraphQlQueryPolicy.CacheFirst &&
    syncStatus === SyncStatus.Synced
  ) {
    return handleGraphQlQueryCacheFirst(event, request);
  } else {
    return handleGraphQlQueryNetworkOnly(event, request);
  }
}

async function handleGraphQlQueryNetworkFirst(
  event: FetchEvent,
  syncStatus: SyncStatus,
  request: GraphQlRequest,
): Promise<Response> {
  try {
    return await tryFetch(event, request);
  } catch (error) {
    if (syncStatus === SyncStatus.Synced) {
      return handleGraphQlQueryFromCache(request);
    }
    throw error;
  }
}

async function handleGraphQlQueryCacheFirst(
  event: FetchEvent,
  request: GraphQlRequest,
): Promise<Response> {
  try {
    return await handleGraphQlQueryFromCache(request);
  } catch (error) {
    return tryFetch(event, request);
  }
}

async function handleGraphQlQueryNetworkOnly(
  event: FetchEvent,
  request: GraphQlRequest,
): Promise<Response> {
  const response = await fetch(event.request);
  event.waitUntil(cacheGraphQlResponse(request, response));
  return response;
}

async function handleGraphQlQueryFromCache(
  request: GraphQlRequest,
): Promise<Response> {
  switch (request.operationName) {
    case GraphQlQuery.GetLanguages:
      return handleGraphQlQueryLanguagesFromCache();
    case GraphQlQuery.GetProperties:
      return handleGraphQlQueryPropertiesFromCache(request);
    case GraphQlQuery.GetWords:
      return handleGraphQlQueryWordsFromCache(request);
    case GraphQlQuery.GetWord:
      return handleGraphQlQueryWordFromCache(request);
    default:
      throw new Error(`Unknown operationName: ${request.operationName}`);
  }
}

async function handleGraphQlQueryLanguagesFromCache(): Promise<Response> {
  const languages = await cache.fetchLanguages();
  return response<GetLanguagesQuery>({ languages });
}

async function handleGraphQlQueryPropertiesFromCache(
  request: GraphQlRequest,
): Promise<Response> {
  const { languageId, partOfSpeech } =
    request.variables as GetPropertiesQueryVariables;
  const properties = await cache.fetchProperties(
    languageId,
    partOfSpeech ?? undefined,
  );
  return response<GetPropertiesQuery>({
    language: {
      id: languageId,
      __typename: 'Language',
      properties,
    },
  });
}

async function handleGraphQlQueryWordsFromCache(
  request: GraphQlRequest,
): Promise<Response> {
  const { languageId, query, cursor, limit } =
    request.variables as GetWordsQueryVariables;
  const { addedAt, start }: { addedAt?: number; start?: number } = cursor
    ? JSON.parse(atob(cursor))
    : {};

  let words: WordFieldsFragment[];
  if (query) {
    words = await cache.searchWords(languageId, query, limit! + 1, start);
  } else {
    words = await cache.fetchWords(languageId, limit! + 1, addedAt);
  }

  let nextCursor: string | null = null;
  if (words.length > limit!) {
    const lastWord = words.pop()!;
    nextCursor = btoa(
      JSON.stringify(
        query
          ? { start: (start ?? 0) + limit! }
          : { addedAt: lastWord.addedAt },
      ),
    );
  }

  return response<GetWordsQuery>({
    language: {
      id: languageId,
      __typename: 'Language',
      words: {
        items: words,
        nextCursor,
        __typename: 'WordPage',
      },
    },
  });
}

async function handleGraphQlQueryWordFromCache(
  request: GraphQlRequest,
): Promise<Response> {
  const { id } = request.variables as GetWordQueryVariables;
  const word = await cache.fetchWord(id);
  return response<GetWordQuery>({ word });
}

async function cacheGraphQlResponse(
  request: GraphQlRequest,
  response: Response,
) {
  try {
    const responseBody = await response.clone().json();
    const responseData = responseBody.data;
    switch (request.operationName) {
      case GraphQlQuery.GetLanguages: {
        const { languages } = responseData as GetLanguagesQuery;
        await cache.saveLanguages(languages);
        break;
      }
      case GraphQlQuery.GetProperties: {
        const { language } = responseData as GetPropertiesQuery;
        if (language?.properties) {
          await cache.saveProperties(language.properties);
        }
        break;
      }
      case GraphQlQuery.GetWords: {
        const { language } = responseData as GetWordsQuery;
        if (language?.words.items) {
          await cache.saveWords(language.words.items);
        }
        break;
      }
      case GraphQlQuery.GetWord: {
        const { word } = responseData as GetWordQuery;
        if (word) {
          await cache.saveWord(word);
        }
        break;
      }
    }
  } catch (err) {
    console.error('Failed to cache response', err);
  }
}

async function handleGraphQlMutation(
  event: FetchEvent,
  request: GraphQlRequest,
): Promise<Response> {
  // TODO
  console.log(request);
  return fetch(event.request);
}

async function getGraphQlRequest(event: FetchEvent): Promise<GraphQlRequest> {
  return await event.request.clone().json();
}

function isGraphQlQuery(request: GraphQlRequest): boolean {
  return Object.values(GraphQlQuery).includes(
    request.operationName as GraphQlQuery,
  );
}

function isGraphQlMutation(request: GraphQlRequest): boolean {
  return Object.values(GraphQlMutation).includes(
    request.operationName as GraphQlMutation,
  );
}

async function tryFetch(
  event: FetchEvent,
  request: GraphQlRequest,
): Promise<Response> {
  const response = await fetch(event.request);
  if (response.status >= 500) {
    throw new Error('Server error');
  }

  event.waitUntil(cacheGraphQlResponse(request, response));

  return response;
}

function response<R>(data: R): Response {
  return new Response(JSON.stringify({ data }), {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
