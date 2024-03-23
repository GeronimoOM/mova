import {
  GetWordsQueryVariables,
  GetLanguagesQuery,
  GetPropertiesQueryVariables,
  GetPropertiesQuery,
  WordFieldsFragment,
  GetWordsQuery,
  GetWordQueryVariables,
  GetWordQuery,
} from '../../api/types/graphql';
import { getSyncStatus, SyncStatus } from '../sync';
import * as cache from '../cache';
import { GraphQlRequest, response, tryFetch } from './common';

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

export function isGraphQlQuery(request: GraphQlRequest): boolean {
  return Object.values(GraphQlQuery).includes(
    request.operationName as GraphQlQuery,
  );
}

export async function handleGraphQlQuery(
  event: FetchEvent,
  request: GraphQlRequest,
): Promise<Response> {
  let policy = getGraphQlQueryPolicy(request);
  const syncStatus = await getSyncStatus();
  if (syncStatus === SyncStatus.Empty) {
    policy = GraphQlQueryPolicy.NetworkOnly;
  } else if (
    syncStatus === SyncStatus.Stale &&
    policy === GraphQlQueryPolicy.CacheFirst
  ) {
    policy = GraphQlQueryPolicy.NetworkFirst;
  }

  switch (policy) {
    case GraphQlQueryPolicy.NetworkFirst:
      return handleGraphQlQueryNetworkFirst(event, request);
    case GraphQlQueryPolicy.CacheFirst:
      return handleGraphQlQueryCacheFirst(event, request);
    case GraphQlQueryPolicy.NetworkOnly:
      return handleGraphQlQueryNetworkOnly(event, request);
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

async function handleGraphQlQueryNetworkFirst(
  event: FetchEvent,
  request: GraphQlRequest,
): Promise<Response> {
  try {
    const response = await tryFetch(event);
    event.waitUntil(cacheGraphQlQueryResponse(request, response));
    return response;
  } catch (error) {
    return handleGraphQlQueryFromCache(request);
  }
}

async function handleGraphQlQueryCacheFirst(
  event: FetchEvent,
  request: GraphQlRequest,
): Promise<Response> {
  try {
    return await handleGraphQlQueryFromCache(request);
  } catch (error) {
    const response = await tryFetch(event);
    event.waitUntil(cacheGraphQlQueryResponse(request, response));
    return response;
  }
}

async function handleGraphQlQueryNetworkOnly(
  event: FetchEvent,
  request: GraphQlRequest,
): Promise<Response> {
  const response = await fetch(event.request);
  event.waitUntil(cacheGraphQlQueryResponse(request, response));
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
  const languages = await cache.getLanguages();
  return response<GetLanguagesQuery>({ languages });
}

async function handleGraphQlQueryPropertiesFromCache(
  request: GraphQlRequest,
): Promise<Response> {
  const { languageId, partOfSpeech } =
    request.variables as GetPropertiesQueryVariables;
  const properties = await cache.getProperties(
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
  const {
    addedAt,
    id,
    start,
  }: { addedAt?: number; id?: string; start?: number } = cursor
    ? JSON.parse(atob(cursor))
    : {};

  let words: WordFieldsFragment[];
  if (query) {
    words = await cache.searchWords(languageId, query, limit! + 1, start);
  } else {
    words = await cache.getWords(languageId, limit! + 1, addedAt, id);
  }

  let nextCursor: string | null = null;
  if (words.length > limit!) {
    const lastWord = words.pop()!;
    nextCursor = btoa(
      JSON.stringify(
        query
          ? { start: (start ?? 0) + limit! }
          : { addedAt: lastWord.addedAt, id: lastWord.id },
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
  const word = await cache.getWord(id);
  return response<GetWordQuery>({ word });
}

async function cacheGraphQlQueryResponse(
  request: GraphQlRequest,
  response: Response,
) {
  try {
    const responseBody = await response.clone().json();
    const responseData = responseBody.data;

    switch (request.operationName as GraphQlQuery) {
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
          await cache.updateWords(language.words.items);
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
