import type {
  GetWordQueryVariables,
  GetWordsQueryVariables,
  GetPropertiesQueryVariables,
  GetLanguagesQuery,
  GetPropertiesQuery,
  WordFieldsFragment,
  GetWordsQuery,
  GetWordQuery,
  CreateWordMutation,
  CreateLanguageMutation,
  UpdateLanguageMutation,
  DeleteLanguageMutation,
  CreatePropertyMutation,
  UpdateWordMutation,
  UpdatePropertyMutation,
  ReorderPropertiesMutation,
  DeletePropertyMutation,
  DeleteWordMutation,
  ApplyChangeInput,
  CreateLanguageMutationVariables,
  UpdateLanguageMutationVariables,
  DeleteLanguageMutationVariables,
  UpdateWordMutationVariables,
  CreatePropertyMutationVariables,
  UpdatePropertyMutationVariables,
  ReorderPropertiesMutationVariables,
  DeletePropertyMutationVariables,
  CreateWordMutationVariables,
  DeleteWordMutationVariables,
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

export function matchGraphqlRequest(url: URL): boolean {
  return url.pathname === '/api/graphql';
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

async function handleGraphQlQueryNetworkFirst(
  event: FetchEvent,
  request: GraphQlRequest,
): Promise<Response> {
  try {
    const response = await tryFetch(event);
    event.waitUntil(cacheGraphQlResponse(request, response));
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
    event.waitUntil(cacheGraphQlResponse(request, response));
    return response;
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
      case GraphQlMutation.CreateLanguage: {
        const { createLanguage } = responseData as CreateLanguageMutation;
        await cache.saveLanguage(createLanguage);
        break;
      }
      case GraphQlMutation.UpdateLanguage: {
        const { updateLanguage } = responseData as UpdateLanguageMutation;
        await cache.updateLanguage(updateLanguage);
        break;
      }
      case GraphQlMutation.DeleteLanguage: {
        const { deleteLanguage } = responseData as DeleteLanguageMutation;
        await cache.deleteLanguage(deleteLanguage.id);
        break;
      }
      case GraphQlMutation.CreateProperty: {
        const { createProperty } = responseData as CreatePropertyMutation;
        await cache.saveProperty(createProperty);
        break;
      }
      case GraphQlMutation.UpdateProperty: {
        const { updateProperty } = responseData as UpdatePropertyMutation;
        await cache.updateProperty(updateProperty);
        break;
      }
      case GraphQlMutation.ReorderProperties: {
        const { reorderProperties } = responseData as ReorderPropertiesMutation;
        await cache.reorderProperties(reorderProperties.map(({ id }) => id));
        break;
      }
      case GraphQlMutation.DeleteProperty: {
        const { deleteProperty } = responseData as DeletePropertyMutation;
        await cache.deleteProperty(deleteProperty.id);
        break;
      }
      case GraphQlMutation.CreateWord: {
        const { createWord } = responseData as CreateWordMutation;
        await cache.saveWord(createWord);
        break;
      }
      case GraphQlMutation.UpdateWord: {
        const { updateWord } = responseData as UpdateWordMutation;
        await cache.updateWord(updateWord);
        break;
      }
      case GraphQlMutation.DeleteWord: {
        const { deleteWord } = responseData as DeleteWordMutation;
        await cache.deleteWord(deleteWord.id);
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
  try {
    return await tryFetch(event);
  } catch (err) {
    console.log('Failed to upload mutation. Saving to cache.');

    await cache.saveChange(buildChange(request));
    const response = await handleGraphQlMutationOptimistically(request);
    event.waitUntil(cacheGraphQlResponse(request, response));
    return response;
  }
}

function buildChange(request: GraphQlRequest): ApplyChangeInput {
  switch (request.operationName) {
    case GraphQlMutation.CreateLanguage:
      return {
        createLanguage: (request.variables as CreateLanguageMutationVariables)
          .input,
      };
    case GraphQlMutation.UpdateLanguage:
      return {
        createLanguage: (request.variables as UpdateLanguageMutationVariables)
          .input,
      };
    case GraphQlMutation.DeleteLanguage:
      return {
        deleteLanguage: (request.variables as DeleteLanguageMutationVariables)
          .input,
      };
    case GraphQlMutation.CreateProperty:
      return {
        createProperty: (request.variables as CreatePropertyMutationVariables)
          .input,
      };
    case GraphQlMutation.UpdateProperty:
      return {
        updateProperty: (request.variables as UpdatePropertyMutationVariables)
          .input,
      };
    case GraphQlMutation.ReorderProperties:
      return {
        reorderProperties: (
          request.variables as ReorderPropertiesMutationVariables
        ).input,
      };
    case GraphQlMutation.DeleteProperty:
      return {
        deleteProperty: (request.variables as DeletePropertyMutationVariables)
          .input,
      };
    case GraphQlMutation.CreateWord:
      return {
        createWord: (request.variables as CreateWordMutationVariables).input,
      };
    case GraphQlMutation.UpdateWord:
      return {
        updateWord: (request.variables as UpdateWordMutationVariables).input,
      };
    case GraphQlMutation.DeleteWord:
      return {
        deleteWord: (request.variables as DeleteWordMutationVariables).input,
      };
    default:
      throw new Error(`Unsupported operation name ${request.operationName}`);
  }
}

async function handleGraphQlMutationOptimistically(
  request: GraphQlRequest,
): Promise<Response> {
  switch (request.operationName) {
    case GraphQlMutation.CreateLanguage:
      return handleCreateLanguageMutation(request);
    case GraphQlMutation.UpdateLanguage:
      return handleUpdateLanguageMutation(request);
    case GraphQlMutation.DeleteLanguage:
      return handleDeleteLanguageMutation(request);
    case GraphQlMutation.CreateProperty:
      return handleCreatePropertyMutation(request);
    case GraphQlMutation.UpdateProperty:
      return handleUpdatePropertyMutation(request);
    case GraphQlMutation.ReorderProperties:
      return handleReorderPropertiesMutation(request);
    case GraphQlMutation.DeleteProperty:
      return handleDeletePropertyMutation(request);
    case GraphQlMutation.CreateWord:
      return handleCreateWordMutation(request);
    case GraphQlMutation.UpdateWord:
      return handleUpdateWordMutation(request);
    case GraphQlMutation.DeleteWord:
      return handleDeleteWordMutation(request);
    default:
      throw new Error(`Unsupported operation name ${request.operationName}`);
  }
}

async function handleCreateLanguageMutation(
  request: GraphQlRequest,
): Promise<Response> {
  const { input } = request.variables as CreateLanguageMutationVariables;

  return response<CreateLanguageMutation>({
    createLanguage: {
      ...input,
      id: input.id!,
      addedAt: input.addedAt!,
    },
  });
}

async function handleUpdateLanguageMutation(
  request: GraphQlRequest,
): Promise<Response> {
  const { input } = request.variables as UpdateLanguageMutationVariables;

  return response<UpdateLanguageMutation>({
    updateLanguage: input,
  });
}

async function handleDeleteLanguageMutation(
  request: GraphQlRequest,
): Promise<Response> {
  const { input } = request.variables as DeleteLanguageMutationVariables;

  return response<DeleteLanguageMutation>({
    deleteLanguage: input,
  });
}

async function handleCreatePropertyMutation(
  request: GraphQlRequest,
): Promise<Response> {
  const { input } = request.variables as CreatePropertyMutationVariables;
  const properties = await cache.getProperties(
    input.languageId,
    input.partOfSpeech,
  );
  const order = properties.length + 1;

  return response<CreatePropertyMutation>({
    createProperty: {
      ...input,
      id: input.id!,
      addedAt: input.addedAt!,
      order,
      __typename: 'TextProperty',
    },
  });
}

async function handleUpdatePropertyMutation(
  request: GraphQlRequest,
): Promise<Response> {
  const { input } = request.variables as UpdatePropertyMutationVariables;
  const property = (await cache.getProperty(input.id))!;

  return response<UpdatePropertyMutation>({
    updateProperty: {
      ...property,
      ...(input.name && { name: input.name }),
    },
  });
}

async function handleReorderPropertiesMutation(
  request: GraphQlRequest,
): Promise<Response> {
  const { input } = request.variables as ReorderPropertiesMutationVariables;
  const properties = await cache.getProperties(
    input.languageId,
    input.partOfSpeech,
  );

  return response<ReorderPropertiesMutation>({
    reorderProperties: input.propertyIds.map(
      (propertyId) => properties.find((prop) => prop.id === propertyId)!,
    ),
  });
}

async function handleDeletePropertyMutation(
  request: GraphQlRequest,
): Promise<Response> {
  const { input } = request.variables as DeletePropertyMutationVariables;
  const property = (await cache.getProperty(input.id))!;

  return response<DeletePropertyMutation>({
    deleteProperty: {
      id: property.id,
      languageId: property.languageId,
      partOfSpeech: property.partOfSpeech,
    },
  });
}

async function handleCreateWordMutation(
  request: GraphQlRequest,
): Promise<Response> {
  const { input } = request.variables as CreateWordMutationVariables;

  return response<CreateWordMutation>({
    createWord: {
      ...input,
      id: input.id!,
      addedAt: input.addedAt!,
      properties:
        input.properties?.map(({ id, text }) => ({
          property: {
            id,
            __typename: 'TextProperty',
          },
          text: text!,
          __typename: 'TextPropertyValue',
        })) ?? [],
    },
  });
}

async function handleUpdateWordMutation(
  request: GraphQlRequest,
): Promise<Response> {
  const { input } = request.variables as UpdateWordMutationVariables;
  const word = (await cache.getWord(input.id))!;

  return response<UpdateWordMutation>({
    updateWord: {
      ...word,
      ...(input.original && { original: input.original }),
      ...(input.translation && { original: input.translation }),
      ...(input.properties && {
        properties: input.properties.reduce((props, { id, text }) => {
          props = props.filter((prop) => prop.property.id !== id);
          if (text) {
            props.push({
              property: {
                id,
                __typename: 'TextProperty',
              },
              text: text!,
              __typename: 'TextPropertyValue',
            });
          }
          return props;
        }, word.properties),
      }),
    },
  });
}

async function handleDeleteWordMutation(
  request: GraphQlRequest,
): Promise<Response> {
  const { input } = request.variables as DeleteWordMutationVariables;
  const word = (await cache.getWord(input.id))!;

  return response<DeleteWordMutation>({
    deleteWord: {
      id: word.id,
      languageId: word.languageId,
    },
  });
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

async function tryFetch(event: FetchEvent): Promise<Response> {
  const response = await fetch(event.request, {});
  if (response.status >= 500) {
    throw new Error('Server error');
  }
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
