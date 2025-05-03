import { fromTimestamp, toTimestamp } from '../utils/datetime';
import { MaxMastery } from '../utils/mastery';
import { updatedOptions } from '../utils/options';
import {
  isOptionPropertyFragment,
  updatedWordProperties,
} from '../utils/properties';
import {
  AttemptWordMasteryMutation,
  AttemptWordMasteryMutationVariables,
  CreateLanguageMutation,
  CreateLanguageMutationVariables,
  CreatePropertyMutation,
  CreatePropertyMutationVariables,
  CreateWordMutation,
  CreateWordMutationVariables,
  DeleteLanguageMutation,
  DeleteLanguageMutationVariables,
  DeletePropertyMutation,
  DeleteWordMutation,
  OptionFieldsFragment,
  PropertyFieldsFragment,
  PropertyType,
  ReorderPropertiesMutation,
  ReorderPropertiesMutationVariables,
  UpdateLanguageMutation,
  UpdateLanguageMutationVariables,
  UpdatePropertyMutation,
  UpdatePropertyMutationVariables,
  UpdateWordMutation,
  UpdateWordMutationVariables,
  WordFieldsFragment,
  WordFieldsFullFragment,
} from './types/graphql';

export function optimisticCreateLanguage({
  input,
}: CreateLanguageMutationVariables): CreateLanguageMutation {
  return {
    createLanguage: {
      ...input,
      id: input.id!,
      addedAt: input.addedAt!,
      __typename: 'Language',
    },
  };
}

export function optimisticUpdateLanguage({
  input,
}: UpdateLanguageMutationVariables): UpdateLanguageMutation {
  return {
    updateLanguage: {
      ...input,
      __typename: 'Language',
    },
  };
}

export function optimisticDeleteLanguage({
  input,
}: DeleteLanguageMutationVariables): DeleteLanguageMutation {
  return {
    deleteLanguage: {
      id: input.id,
    },
  };
}

export function optimisticCreateProperty(
  { input }: CreatePropertyMutationVariables,
  properties: PropertyFieldsFragment[],
): CreatePropertyMutation {
  const order =
    properties.reduce(
      (maxOrder, { order }) => (order > maxOrder ? order : maxOrder),
      0,
    ) + 1;

  const baseProperty = {
    ...input,
    id: input.id!,
    addedAt: input.addedAt!,
    order,
  };

  let property: PropertyFieldsFragment;
  if (input.type === PropertyType.Text) {
    property = {
      ...baseProperty,
      __typename: 'TextProperty',
    };
  } else {
    property = {
      ...baseProperty,
      options: (input.options ?? []).map((option) => ({
        id: option.id!,
        value: option.value,
        color: option.color,
        __typename: 'Option',
      })),
      __typename: 'OptionProperty',
    };
  }

  return {
    createProperty: property,
  };
}

export function optimisticUpdateProperty(
  { input }: UpdatePropertyMutationVariables,
  currentProperty: PropertyFieldsFragment,
): UpdatePropertyMutation {
  let options: OptionFieldsFragment[] | undefined;
  if (isOptionPropertyFragment(currentProperty) && input.options) {
    options = updatedOptions(currentProperty.options, input.options);
  }

  return {
    updateProperty: {
      ...currentProperty,
      ...(input.name && { name: input.name }),
      ...(options && { options }),
    },
  };
}

export function optimisticReorderProperties(
  { input }: ReorderPropertiesMutationVariables,
  properties: PropertyFieldsFragment[],
): ReorderPropertiesMutation {
  return {
    reorderProperties: input.propertyIds.map((propertyId, index) => ({
      ...properties.find((prop) => prop.id === propertyId)!,
      order: index + 1,
    })),
  };
}

export function optimisticDeleteProperty(
  currentProperty: PropertyFieldsFragment,
): DeletePropertyMutation {
  return {
    deleteProperty: currentProperty,
  };
}

export function optimisticCreateWord({
  input,
}: CreateWordMutationVariables): CreateWordMutation {
  const properties = updatedWordProperties(undefined, input.properties ?? []);

  return {
    createWord: {
      ...input,
      id: input.id!,
      addedAt: input.addedAt!,
      mastery: 0,
      nextExerciseAt: toTimestamp(
        fromTimestamp(input.addedAt!)!.plus({ days: 1 }),
      )!,
      properties,
      __typename: 'Word',
    },
  };
}

export function optimisticUpdateWord(
  { input }: UpdateWordMutationVariables,
  currentWord: WordFieldsFullFragment,
): UpdateWordMutation {
  let properties = currentWord.properties;
  if (input.properties) {
    properties = updatedWordProperties(
      currentWord.properties,
      input.properties,
    );
  }

  return {
    updateWord: {
      ...currentWord,
      ...(input.original && { name: input.original }),
      ...(input.translation && { name: input.translation }),
      properties,
    },
  };
}

export function optimisticDeleteWord(
  currentWord: WordFieldsFragment,
): DeleteWordMutation {
  return {
    deleteWord: currentWord,
  };
}

export function optimisticAttemptWordMastery(
  { success }: AttemptWordMasteryMutationVariables,
  currentWord: WordFieldsFragment,
): AttemptWordMasteryMutation {
  return {
    attemptMastery: success
      ? {
          ...currentWord,
          mastery: Math.min(currentWord.mastery + 1, MaxMastery),
        }
      : currentWord,
  };
}
