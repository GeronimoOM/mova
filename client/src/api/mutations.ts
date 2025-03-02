import { TypedDocumentNode, useMutation } from '@apollo/client';
import { fromTimestamp, toTimestamp } from '../utils/datetime';
import { MaxMastery } from '../utils/mastery';
import { isOptionPropertyFragment } from '../utils/properties';
import { cache } from './cache';
import {
  AttemptWordMasteryDocument,
  CreateLanguageDocument,
  CreatePropertyDocument,
  CreatePropertyMutation,
  CreatePropertyMutationVariables,
  CreateWordDocument,
  CreateWordMutation,
  CreateWordMutationVariables,
  DeleteLanguageDocument,
  DeletePropertyDocument,
  DeleteWordDocument,
  GetLanguagesDocument,
  GetProgressDocument,
  LanguagePropertiesFragmentDoc,
  LanguageWordsFragmentDoc,
  OptionFieldsFragment,
  PartOfSpeech,
  ProgressType,
  PropertyFieldsFragment,
  PropertyFieldsFragmentDoc,
  PropertyType,
  PropertyValueFieldsFragment,
  ReorderPropertiesDocument,
  SetGoalsDocument,
  UpdateLanguageDocument,
  UpdatePropertyDocument,
  UpdatePropertyMutation,
  UpdatePropertyMutationVariables,
  UpdateWordDocument,
  UpdateWordMutation,
  UpdateWordMutationVariables,
  WordFieldsFragment,
  WordFieldsFragmentDoc,
  WordFieldsFullFragment,
  WordFieldsFullFragmentDoc,
} from './types/graphql';

type UseMutationResult<MDocument> =
  MDocument extends TypedDocumentNode<infer MData, infer MVariables>
    ? ReturnType<typeof useMutation<MData, MVariables>>
    : never;

export function useCreateLanguage(): UseMutationResult<
  typeof CreateLanguageDocument
> {
  return useMutation(CreateLanguageDocument, {
    optimisticResponse: ({ input }) => ({
      createLanguage: {
        ...input,
        id: input.id!,
        addedAt: input.addedAt!,
      },
    }),
    update: (cache, { data }) => {
      cache.updateQuery(
        {
          query: GetLanguagesDocument,
          overwrite: true,
        },
        (query) => ({
          languages: [...(query?.languages ?? []), data!.createLanguage],
        }),
      );
    },
  });
}

export function useUpdateLanguage(): UseMutationResult<
  typeof UpdateLanguageDocument
> {
  return useMutation(UpdateLanguageDocument, {
    optimisticResponse: ({ input }) => ({
      updateLanguage: input,
    }),
  });
}

export function useDeleteLanguage(): UseMutationResult<
  typeof DeleteLanguageDocument
> {
  return useMutation(DeleteLanguageDocument, {
    optimisticResponse: ({ input: { id } }) => ({
      deleteLanguage: {
        id,
      },
    }),
    update: (cache, { data }) => {
      cache.updateQuery(
        {
          query: GetLanguagesDocument,
          overwrite: true,
        },
        (query) => ({
          languages: (query?.languages ?? []).filter(
            ({ id }) => id !== data!.deleteLanguage.id,
          ),
        }),
      );
    },
  });
}

export function useCreateProperty(): UseMutationResult<
  typeof CreatePropertyDocument
> {
  return useMutation(CreatePropertyDocument, {
    optimisticResponse: createPropertyOptimisticResponse,
    update: (cache, { data }, { variables }) => {
      cache.updateFragment(
        {
          id: `Language:${variables!.input.languageId}`,
          fragment: LanguagePropertiesFragmentDoc,
          fragmentName: 'LanguageProperties',
          variables: { partOfSpeech: variables!.input.partOfSpeech },
          overwrite: true,
        },
        (properties) => ({
          properties: [...(properties?.properties ?? []), data!.createProperty],
        }),
      );
    },
  });
}

function createPropertyOptimisticResponse({
  input,
}: CreatePropertyMutationVariables): CreatePropertyMutation {
  const properties = readPartOfSpeechProperties(
    input.languageId,
    input.partOfSpeech,
  );
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

export function useUpdateProperty(): UseMutationResult<
  typeof UpdatePropertyDocument
> {
  return useMutation(UpdatePropertyDocument, {
    optimisticResponse: updatePropertyOptimisticResponse,
  });
}

function updatePropertyOptimisticResponse({
  input,
}: UpdatePropertyMutationVariables): UpdatePropertyMutation {
  const currentProperty = readProperty(input.id)!;
  const currentOptions = isOptionPropertyFragment(currentProperty)
    ? currentProperty.options
    : undefined;

  const options: OptionFieldsFragment[] | undefined = input.options
    ? input.options.reduce((current, { id, value, color }) => {
        if (!value) {
          return current.filter((opt) => opt.id !== id);
        }

        const newOption: OptionFieldsFragment = {
          id: id!,
          value,
          color,
          __typename: 'Option',
        };
        const currentOptionIdx = current.findIndex((opt) => opt.id === id);
        if (currentOptionIdx === -1) {
          return [...current, newOption];
        }

        return current.toSpliced(currentOptionIdx, 1, newOption);
      }, currentOptions ?? [])
    : undefined;

  return {
    updateProperty: {
      ...currentProperty,
      ...(input.name && { name: input.name }),
      ...(options && { options }),
    },
  };
}

export function useReorderProperties(): UseMutationResult<
  typeof ReorderPropertiesDocument
> {
  return useMutation(ReorderPropertiesDocument, {
    optimisticResponse: ({ input }) => ({
      reorderProperties: input.propertyIds.map(
        (propertyId) => readProperty(propertyId)!,
      ),
    }),
    update: (cache, { data }, { variables }) => {
      cache.updateFragment(
        {
          id: `Language:${variables!.input.languageId}`,
          fragment: LanguagePropertiesFragmentDoc,
          fragmentName: 'LanguageProperties',
          variables: { partOfSpeech: variables!.input.partOfSpeech },
        },
        (fragment) => ({
          ...fragment,
          properties: data!.reorderProperties.map(
            ({ id }) => fragment!.properties.find((prop) => prop.id === id)!,
          ),
        }),
      );
    },
  });
}

export function useDeleteProperty(): UseMutationResult<
  typeof DeletePropertyDocument
> {
  return useMutation(DeletePropertyDocument, {
    optimisticResponse: ({ input: { id } }) => ({
      deleteProperty: readProperty(id)!,
    }),
    update: (cache, { data }) => {
      cache.updateFragment(
        {
          id: `Language:${data!.deleteProperty.languageId}`,
          fragment: LanguagePropertiesFragmentDoc,
          fragmentName: 'LanguageProperties',
          variables: { partOfSpeech: data!.deleteProperty.partOfSpeech },
          overwrite: true,
        },
        (properties) => ({
          properties: (properties?.properties ?? []).filter(
            ({ id }) => id !== data!.deleteProperty.id,
          ),
        }),
      );
    },
  });
}

export function useCreateWord(): UseMutationResult<typeof CreateWordDocument> {
  return useMutation(CreateWordDocument, {
    optimisticResponse: createWordOptimisticResponse,
    update: (cache, { data }, { variables }) => {
      cache.updateFragment(
        {
          id: `Language:${variables!.input.languageId}`,
          fragment: LanguageWordsFragmentDoc,
          fragmentName: 'LanguageWords',
          overwrite: true,
        },
        (wordsPage) => ({
          words: {
            items: [data!.createWord, ...(wordsPage?.words.items ?? [])],
            nextCursor: wordsPage?.words.nextCursor,
          },
        }),
      );
    },
  });
}

function createWordOptimisticResponse({
  input,
}: CreateWordMutationVariables): CreateWordMutation {
  const properties: PropertyValueFieldsFragment[] =
    input.properties?.map(({ id, text, option }) => {
      if (text) {
        return {
          property: {
            id,
            __typename: 'TextProperty',
          },
          text,
          __typename: 'TextPropertyValue',
        };
      }

      return {
        property: {
          id,
          __typename: 'OptionProperty',
        },
        option: {
          id: option!.id,
          value: option!.value!,
          color: option!.color,
          __typename: 'OptionValue',
        },
        __typename: 'OptionPropertyValue',
      };
    }) ?? [];

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

export function useUpdateWord(): UseMutationResult<typeof UpdateWordDocument> {
  return useMutation(UpdateWordDocument, {
    optimisticResponse: updateWordOptimisticResponse,
  });
}

function updateWordOptimisticResponse({
  input,
}: UpdateWordMutationVariables): UpdateWordMutation {
  const word = readWordFull(input.id)!;
  let properties = word.properties;
  if (input.properties) {
    properties = input.properties.reduce((current, { id, text, option }) => {
      if (!text && !option) {
        return current.filter((prop) => prop.property.id !== id);
      }

      let newPropValue: PropertyValueFieldsFragment;
      if (text) {
        newPropValue = {
          property: {
            id,
            __typename: 'TextProperty',
          },
          text,
          __typename: 'TextPropertyValue',
        };
      } else {
        newPropValue = {
          property: {
            id,
            __typename: 'OptionProperty',
          },
          option: {
            id: option!.id ?? null,
            value: option!.value!,
            color: option!.color ?? null,
            __typename: 'OptionValue',
          },
          __typename: 'OptionPropertyValue',
        };
      }

      const currentPropIdx = current.findIndex(
        (propValue) => propValue.property.id === id,
      );
      if (currentPropIdx === -1) {
        return [...current, newPropValue];
      }

      return current.toSpliced(currentPropIdx, 1, newPropValue);
    }, properties);
  }

  return {
    updateWord: {
      ...word,
      ...(input.original && { name: input.original }),
      ...(input.translation && { name: input.translation }),
      properties,
    },
  };
}

export function useDeleteWord(): UseMutationResult<typeof DeleteWordDocument> {
  return useMutation(DeleteWordDocument, {
    optimisticResponse: ({ input: { id } }) => ({
      deleteWord: {
        id,
        languageId: readWordFull(id)!.languageId,
      },
    }),
    update: (cache, { data }) => {
      cache.updateFragment(
        {
          id: `Language:${data!.deleteWord.languageId}`,
          fragment: LanguageWordsFragmentDoc,
          fragmentName: 'LanguageWords',
          overwrite: true,
        },
        (wordsPage) => ({
          words: {
            items: (wordsPage?.words.items ?? []).filter(
              ({ id }) => id !== data!.deleteWord.id,
            ),
            nextCursor: wordsPage?.words.nextCursor,
          },
        }),
      );
    },
  });
}

export function useAttemptWordMastery(): UseMutationResult<
  typeof AttemptWordMasteryDocument
> {
  return useMutation(AttemptWordMasteryDocument, {
    optimisticResponse: ({ wordId, success }) => {
      const word = readWordFull(wordId)!;

      return {
        attemptMastery: success
          ? {
              ...word,
              mastery: Math.min(word.mastery + 1, MaxMastery),
            }
          : word,
      };
    },
    update: (_, { data }, { variables }) => {
      updateWord(data!.attemptMastery);
      if (variables?.success) {
        const word = readWordFull(data!.attemptMastery.id)!;
        increaseCurrentProgress(word.languageId, ProgressType.Mastery);
      }
    },
  });
}

export function useSetGoals(): UseMutationResult<typeof SetGoalsDocument> {
  return useMutation(SetGoalsDocument, {
    optimisticResponse: ({ input }) => {
      return {
        setGoals: input.goals.map((goal) => ({
          languageId: input.languageId,
          ...goal,
        })),
      };
    },
  });
}

function readProperty(id: string): PropertyFieldsFragment | null {
  return cache.readFragment({
    id: `Property:${id}`,
    fragment: PropertyFieldsFragmentDoc,
    fragmentName: 'PropertyFields',
  })!;
}

function readPartOfSpeechProperties(
  languageId: string,
  partOfSpeech: PartOfSpeech,
): PropertyFieldsFragment[] {
  return cache.readFragment({
    id: `Language:${languageId}`,
    variables: { partOfSpeech },
    fragment: LanguagePropertiesFragmentDoc,
    fragmentName: 'LanguageProperties',
  })!.properties;
}

function readWordFull(id: string): WordFieldsFullFragment | null {
  return cache.readFragment({
    id: `Word:${id}`,
    fragment: WordFieldsFullFragmentDoc,
    fragmentName: 'WordFieldsFull',
  })!;
}

function updateWord(word: WordFieldsFragment) {
  cache.writeFragment({
    id: `Word:${word.id}`,
    fragment: WordFieldsFragmentDoc,
    fragmentName: 'WordFields',
    data: word,
  });
}

function increaseCurrentProgress(languageId: string, type: ProgressType) {
  cache.updateQuery(
    {
      query: GetProgressDocument,
      variables: { languageId, type },
      overwrite: true,
    },
    (query) =>
      query?.language?.progress
        ? {
            language: {
              ...query.language,
              progress: {
                ...query!.language!.progress,
                current: {
                  ...query!.language!.progress.current,
                  points: query!.language!.progress.current.points + 1,
                },
              },
            },
          }
        : null,
  );
}
