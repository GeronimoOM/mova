import { TypedDocumentNode, useMutation } from '@apollo/client';
import { MaxMastery } from '../utils/mastery';
import { cache } from './cache';
import {
  AttemptWordMasteryDocument,
  CreateLanguageDocument,
  CreatePropertyDocument,
  CreateWordDocument,
  DeleteLanguageDocument,
  DeletePropertyDocument,
  DeleteWordDocument,
  GetLanguagesDocument,
  GetProgressDocument,
  LanguagePropertiesFragmentDoc,
  LanguageWordsFragmentDoc,
  PartOfSpeech,
  ProgressType,
  PropertyFieldsFragment,
  PropertyFieldsFragmentDoc,
  ReorderPropertiesDocument,
  SetGoalsDocument,
  UpdateLanguageDocument,
  UpdatePropertyDocument,
  UpdateWordDocument,
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
    optimisticResponse: ({ input }) => {
      const properties = readPartOfSpeechProperties(
        input.languageId,
        input.partOfSpeech,
      );
      const order =
        properties.reduce(
          (maxOrder, { order }) => (order > maxOrder ? order : maxOrder),
          0,
        ) + 1;

      return {
        createProperty: {
          ...input,
          id: input.id!,
          addedAt: input.addedAt!,
          order,
          __typename: 'TextProperty',
        },
      };
    },
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

export function useUpdateProperty(): UseMutationResult<
  typeof UpdatePropertyDocument
> {
  return useMutation(UpdatePropertyDocument, {
    optimisticResponse: ({ input }) => ({
      updateProperty: {
        ...readProperty(input.id)!,
        ...(input.name && { name: input.name }),
      },
    }),
  });
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
    optimisticResponse: ({ input }) => ({
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
    }),
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

export function useUpdateWord(): UseMutationResult<typeof UpdateWordDocument> {
  return useMutation(UpdateWordDocument, {
    optimisticResponse: ({ input }) => {
      const word = readWordFull(input.id)!;

      return {
        updateWord: {
          ...word,
          ...(input.original && { name: input.original }),
          ...(input.translation && { name: input.translation }),
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
      };
    },
  });
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
