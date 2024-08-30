import {
  ApplyChangeInput,
  CreateLanguageMutation,
  CreateLanguageMutationVariables,
  CreatePropertyMutation,
  CreatePropertyMutationVariables,
  CreateWordMutation,
  CreateWordMutationVariables,
  DeleteLanguageMutation,
  DeleteLanguageMutationVariables,
  DeletePropertyMutation,
  DeletePropertyMutationVariables,
  DeleteWordMutation,
  DeleteWordMutationVariables,
  IncreaseWordMasteryMutation,
  ReorderPropertiesMutation,
  ReorderPropertiesMutationVariables,
  UpdateLanguageMutation,
  UpdateLanguageMutationVariables,
  UpdatePropertyMutation,
  UpdatePropertyMutationVariables,
  UpdateWordMutation,
  UpdateWordMutationVariables,
} from '../../../api/types/graphql';
import * as cache from '../cache';
import { GraphQlRequest, response, tryFetch } from './common';

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
  IncreaseMastery = 'IncreaseMastery',
}

export function isGraphQlMutation(request: GraphQlRequest): boolean {
  return Object.values(GraphQlMutation).includes(
    request.operationName as GraphQlMutation,
  );
}

export async function handleGraphQlMutation(
  event: FetchEvent,
  request: GraphQlRequest,
): Promise<Response> {
  try {
    const response = await tryFetch(event);
    event.waitUntil(cacheGraphQlMutationResponse(request, response));

    return response;
  } catch (err) {
    console.log('Mutation request failed. Saving to cache.');

    await cache.saveChange(buildChange(request));
    const response = await handleGraphQlMutationOptimistically(request);
    event.waitUntil(cacheGraphQlMutationResponse(request, response));

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
        updateLanguage: (request.variables as UpdateLanguageMutationVariables)
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
      __typename: 'Language',
    },
  });
}

async function handleUpdateLanguageMutation(
  request: GraphQlRequest,
): Promise<Response> {
  const { input } = request.variables as UpdateLanguageMutationVariables;

  return response<UpdateLanguageMutation>({
    updateLanguage: {
      ...input,
      __typename: 'Language',
    },
  });
}

async function handleDeleteLanguageMutation(
  request: GraphQlRequest,
): Promise<Response> {
  const { input } = request.variables as DeleteLanguageMutationVariables;

  return response<DeleteLanguageMutation>({
    deleteLanguage: {
      ...input,
      __typename: 'Language',
    },
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
  const order =
    properties.reduce(
      (maxOrder, { order }) => (order > maxOrder ? order : maxOrder),
      0,
    ) + 1;

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
      __typename: 'TextProperty',
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
      __typename: 'TextProperty',
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
      mastery: 0,
      properties:
        input.properties?.map(({ id, text }) => ({
          property: {
            id,
            __typename: 'TextProperty',
          },
          text: text!,
          __typename: 'TextPropertyValue',
        })) ?? [],
      __typename: 'Word',
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
      ...(input.translation && { translation: input.translation }),
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
      __typename: 'Word',
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
      __typename: 'Word',
    },
  });
}

async function cacheGraphQlMutationResponse(
  request: GraphQlRequest,
  response: Response,
) {
  try {
    const responseBody = await response.clone().json();
    const responseData = responseBody.data;

    switch (request.operationName as GraphQlMutation) {
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
      case GraphQlMutation.IncreaseMastery: {
        const { increaseMastery } = responseData as IncreaseWordMasteryMutation;
        await cache.updateWord(increaseMastery);
        break;
      }
    }
  } catch (err) {
    console.error('Failed to cache response', err);
  }
}
