import {
  MutationHookOptions,
  TypedDocumentNode,
  useMutation,
} from '@apollo/client';
import { cache } from './cache';
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
} from './optimistic';
import {
  AttemptWordMasteryDocument,
  CreateLanguageDocument,
  CreateLinkDocument,
  CreatePropertyDocument,
  CreateWordDocument,
  DeleteLanguageDocument,
  DeleteLinkDocument,
  DeletePropertyDocument,
  DeleteWordDocument,
  GetLanguagesDocument,
  GetProgressDocument,
  LanguagePropertiesFragmentDoc,
  LanguageWordsFragmentDoc,
  LinkedWordFieldsFragment,
  PartOfSpeech,
  ProgressType,
  PropertyFieldsFragment,
  PropertyFieldsFragmentDoc,
  ReorderPropertiesDocument,
  SetGoalsDocument,
  UpdateLanguageDocument,
  UpdatePropertyDocument,
  UpdateWordDocument,
  WordFieldsFragment,
  WordFieldsFragmentDoc,
  WordFieldsFullFragment,
  WordFieldsFullFragmentDoc,
  WordFieldsLinksFragmentDoc,
  WordLinkType,
} from './types/graphql';

type UseMutationResult<MDocument> =
  MDocument extends TypedDocumentNode<infer MData, infer MVariables>
    ? ReturnType<typeof useMutation<MData, MVariables>>
    : never;

export function useCreateLanguage(): UseMutationResult<
  typeof CreateLanguageDocument
> {
  return useMutation(CreateLanguageDocument, {
    optimisticResponse: optimisticCreateLanguage,
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
    optimisticResponse: optimisticUpdateLanguage,
  });
}

export function useDeleteLanguage(): UseMutationResult<
  typeof DeleteLanguageDocument
> {
  return useMutation(DeleteLanguageDocument, {
    optimisticResponse: optimisticDeleteLanguage,
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
    optimisticResponse: (variables) => {
      const properties = readPartOfSpeechProperties(
        variables.input.languageId,
        variables.input.partOfSpeech,
      );

      return optimisticCreateProperty(variables, properties);
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
    optimisticResponse: (variables) => {
      const currentProperty = readProperty(variables.input.id)!;

      return optimisticUpdateProperty(variables, currentProperty);
    },
  });
}

export function useReorderProperties(): UseMutationResult<
  typeof ReorderPropertiesDocument
> {
  return useMutation(ReorderPropertiesDocument, {
    optimisticResponse: (variables) => {
      const properties = readPartOfSpeechProperties(
        variables.input.languageId,
        variables.input.partOfSpeech,
      );

      return optimisticReorderProperties(variables, properties);
    },
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
    optimisticResponse: ({ input: { id } }) =>
      optimisticDeleteProperty(readProperty(id)!),
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
    optimisticResponse: optimisticCreateWord,
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
    optimisticResponse: (variables) => {
      const currentWord = readWordFull(variables.input.id)!;

      return optimisticUpdateWord(variables, currentWord);
    },
  });
}

export function useDeleteWord(): UseMutationResult<typeof DeleteWordDocument> {
  return useMutation(DeleteWordDocument, {
    optimisticResponse: ({ input: { id } }) =>
      optimisticDeleteWord(readWordFull(id)!),
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

export function useCreateLink(): UseMutationResult<typeof CreateLinkDocument> {
  return useMutation(CreateLinkDocument, {
    optimisticResponse: optimisticCreateLink,
  });
}

export const buildCreateLinkRefetchQueries = (
  wordId: string,
  type: WordLinkType,
  link: LinkedWordFieldsFragment,
): Partial<MutationHookOptions> => ({
  update: (cache) => {
    cache.updateFragment(
      {
        id: `Word:${wordId}`,
        fragment: WordFieldsLinksFragmentDoc,
        fragmentName: 'WordFieldsLinks',
        overwrite: true,
      },
      (word) => ({
        ...word!,
        ...(type === WordLinkType.Similar && {
          similarLinks: [...word!.similarLinks, link],
        }),
        ...(type === WordLinkType.Distinct && {
          distinctLinks: [...word!.distinctLinks, link],
        }),
      }),
    );
  },
});

export function useDeleteLink(): UseMutationResult<typeof DeleteLinkDocument> {
  return useMutation(DeleteLinkDocument, {
    optimisticResponse: optimisticDeleteLink,
  });
}

export const buildDeleteLinkRefetchQueries = (
  wordId: string,
  type: WordLinkType,
  link: LinkedWordFieldsFragment,
): Partial<MutationHookOptions> => ({
  update: (cache) => {
    cache.updateFragment(
      {
        id: `Word:${wordId}`,
        fragment: WordFieldsLinksFragmentDoc,
        fragmentName: 'WordFieldsLinks',
        overwrite: true,
      },
      (word) => ({
        ...word!,
        ...(type === WordLinkType.Similar && {
          similarLinks: word!.similarLinks?.filter((l) => l.id !== link.id),
        }),
        ...(type === WordLinkType.Distinct && {
          distinctLinks: word!.distinctLinks?.filter((l) => l.id !== link.id),
        }),
      }),
    );
  },
});

export function useAttemptWordMastery(): UseMutationResult<
  typeof AttemptWordMasteryDocument
> {
  return useMutation(AttemptWordMasteryDocument, {
    optimisticResponse: (variables) => {
      const word = readWordFull(variables.wordId)!;

      return optimisticAttemptWordMastery(variables, word);
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
