import {
  optimisticAttemptWordMastery,
  optimisticCreateLanguage,
  optimisticCreateLink,
  optimisticCreateProperty,
  optimisticCreateWord,
  optimisticDeleteLanguage,
  optimisticDeleteLink,
  optimisticDeleteProperty,
  optimisticDeleteWord,
  optimisticReorderProperties,
  optimisticUpdateLanguage,
  optimisticUpdateProperty,
  optimisticUpdateWord,
} from '../../../api/optimistic';
import {
  ApplyChangeInput,
  AttemptWordMasteryMutation,
  AttemptWordMasteryMutationVariables,
  CreateLanguageMutation,
  CreateLanguageMutationVariables,
  CreateLinkMutation,
  CreateLinkMutationVariables,
  CreatePropertyMutation,
  CreatePropertyMutationVariables,
  CreateWordMutation,
  CreateWordMutationVariables,
  DeleteLanguageMutation,
  DeleteLanguageMutationVariables,
  DeleteLinkMutation,
  DeleteLinkMutationVariables,
  DeletePropertyMutation,
  DeletePropertyMutationVariables,
  DeleteWordMutation,
  DeleteWordMutationVariables,
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
  CreateLink = 'CreateLink',
  DeleteLink = 'DeleteLink',
  AttemptMastery = 'AttemptMastery',
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
  } catch {
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
    case GraphQlMutation.CreateLink:
      return {
        createWordLink: (request.variables as CreateLinkMutationVariables)
          .input,
      };
    case GraphQlMutation.DeleteLink:
      return {
        createWordLink: (request.variables as DeleteLinkMutationVariables)
          .input,
      };
    default:
      throw new Error(`Unsupported operation name ${request.operationName}`);
  }
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
      case GraphQlMutation.CreateLink: {
        const { createLink } = responseData as CreateLinkMutation;
        await cache.saveLink(createLink);
        break;
      }
      case GraphQlMutation.DeleteLink: {
        const { deleteLink } = responseData as DeleteLinkMutation;
        await cache.deleteLink(deleteLink);
        break;
      }
      case GraphQlMutation.AttemptMastery: {
        const { attemptMastery } = responseData as AttemptWordMasteryMutation;
        await cache.updateWord(attemptMastery);
        break;
      }
    }
  } catch (err) {
    console.error('Failed to cache response', err);
  }
}

async function handleGraphQlMutationOptimistically(
  request: GraphQlRequest,
): Promise<Response> {
  switch (request.operationName) {
    case GraphQlMutation.CreateLanguage:
      return response(
        optimisticCreateLanguage(
          request.variables as CreateLanguageMutationVariables,
        ),
      );
    case GraphQlMutation.UpdateLanguage:
      return response(
        optimisticUpdateLanguage(
          request.variables as UpdateLanguageMutationVariables,
        ),
      );
    case GraphQlMutation.DeleteLanguage:
      return response(
        optimisticDeleteLanguage(
          request.variables as DeleteWordMutationVariables,
        ),
      );
    case GraphQlMutation.CreateProperty: {
      const variables = request.variables as CreatePropertyMutationVariables;
      const properties = await cache.getProperties(
        variables.input.languageId,
        variables.input.partOfSpeech,
      );

      return response(optimisticCreateProperty(variables, properties));
    }
    case GraphQlMutation.UpdateProperty: {
      const variables = request.variables as UpdatePropertyMutationVariables;
      const currentProperty = (await cache.getProperty(variables.input.id))!;

      return response(optimisticUpdateProperty(variables, currentProperty));
    }
    case GraphQlMutation.ReorderProperties: {
      const variables = request.variables as ReorderPropertiesMutationVariables;
      const properties = await cache.getProperties(
        variables.input.languageId,
        variables.input.partOfSpeech,
      );

      return response(optimisticReorderProperties(variables, properties));
    }
    case GraphQlMutation.DeleteProperty: {
      const variables = request.variables as DeletePropertyMutationVariables;
      const currentProperty = (await cache.getProperty(variables.input.id))!;

      return response(optimisticDeleteProperty(currentProperty));
    }
    case GraphQlMutation.CreateWord:
      return response(
        optimisticCreateWord(request.variables as CreateWordMutationVariables),
      );
    case GraphQlMutation.UpdateWord: {
      const variables = request.variables as UpdateWordMutationVariables;
      const currentWord = (await cache.getWord(variables.input.id))!;

      return response(optimisticUpdateWord(variables, currentWord));
    }
    case GraphQlMutation.DeleteWord: {
      const variables = request.variables as UpdateWordMutationVariables;
      const currentWord = (await cache.getWord(variables.input.id))!;

      return response(optimisticDeleteWord(currentWord));
    }
    case GraphQlMutation.CreateLink:
      return response(
        optimisticCreateLink(request.variables as CreateLinkMutationVariables),
      );
    case GraphQlMutation.DeleteLink:
      return response(
        optimisticDeleteLink(request.variables as DeleteLinkMutationVariables),
      );
    case GraphQlMutation.AttemptMastery: {
      const variables =
        request.variables as AttemptWordMasteryMutationVariables;
      const currentWord = (await cache.getWord(variables.wordId))!;

      return response(optimisticAttemptWordMastery(variables, currentWord));
    }
    default:
      throw new Error(`Unsupported operation name ${request.operationName}`);
  }
}
