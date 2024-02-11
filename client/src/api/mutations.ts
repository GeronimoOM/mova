import { TypedDocumentNode } from '@apollo/client';
import { createMutation } from '@merged/solid-apollo';
import {
  CreateLanguageDocument,
  CreatePropertyDocument,
  CreateWordDocument,
  DeleteLanguageDocument,
  DeletePropertyDocument,
  DeleteWordDocument,
  GetLanguagesDocument,
  LanguagePropertiesFragmentDoc,
  LanguageWordsFragmentDoc,
  PropertyFieldsFragment,
  PropertyFieldsFragmentDoc,
  ReorderPropertiesDocument,
  UpdateLanguageDocument,
  UpdatePropertyDocument,
  UpdateWordDocument,
  WordFieldsFullFragment,
  WordFieldsFullFragmentDoc,
} from './types/graphql';
import { cache } from './cache';

type CreateMutationResult<MDocument> = MDocument extends TypedDocumentNode<
  infer MResult,
  infer MVariables
>
  ? ReturnType<typeof createMutation<MResult, MVariables>>
  : never;

export function createLanguageMutation(): CreateMutationResult<
  typeof CreateLanguageDocument
> {
  return createMutation(CreateLanguageDocument, {
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

export function updateLanguageMutation(): CreateMutationResult<
  typeof UpdateLanguageDocument
> {
  return createMutation(UpdateLanguageDocument, {
    optimisticResponse: ({ input }) => ({
      updateLanguage: input,
    }),
  });
}

export function deleteLanguageMutation(): CreateMutationResult<
  typeof DeleteLanguageDocument
> {
  return createMutation(DeleteLanguageDocument, {
    optimisticResponse: ({ id }) => ({
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

export function createPropertyMutation(): CreateMutationResult<
  typeof CreatePropertyDocument
> {
  return createMutation(CreatePropertyDocument, {
    optimisticResponse: ({ input }) => ({
      createProperty: {
        ...input,
        id: input.id!,
        addedAt: input.addedAt!,
      },
    }),
    update: (cache, { data }, { variables }) => {
      cache.updateFragment(
        {
          id: `Language:${variables!.input.languageId}`,
          fragment: LanguagePropertiesFragmentDoc,
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

export function updatePropertyMutation(): CreateMutationResult<
  typeof UpdatePropertyDocument
> {
  return createMutation(UpdatePropertyDocument, {
    optimisticResponse: ({ input }) => ({
      updateProperty: {
        ...readProperty(input.id)!,
        ...(input.name && { name: input.name }),
      },
    }),
  });
}

export function deletePropertyMutation(): CreateMutationResult<
  typeof DeletePropertyDocument
> {
  return createMutation(DeletePropertyDocument, {
    optimisticResponse: ({ id }) => ({
      deleteProperty: readProperty(id)!,
    }),
    update: (cache, { data }) => {
      cache.updateFragment(
        {
          id: `Language:${data!.deleteProperty.languageId}`,
          fragment: LanguagePropertiesFragmentDoc,
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

export function reorderPropertiesMutation(): CreateMutationResult<
  typeof ReorderPropertiesDocument
> {
  return createMutation(ReorderPropertiesDocument, {
    optimisticResponse: ({ input }) => ({
      reorderProperties: input.propertyIds.map(
        (propertyId) => readProperty(propertyId)!,
      ),
    }),
    update: (cache, { data }, { variables }) => {
      cache.writeFragment({
        id: `Language:${variables!.input.languageId}`,
        fragment: LanguagePropertiesFragmentDoc,
        variables: { partOfSpeech: variables!.input.partOfSpeech },
        overwrite: true,
        data: { properties: data!.reorderProperties },
      });
    },
  });
}

export function createWordMutation(): CreateMutationResult<
  typeof CreateWordDocument
> {
  return createMutation(CreateWordDocument, {
    optimisticResponse: ({ input }) => ({
      createWord: {
        ...input,
        id: input.id!,
        addedAt: input.addedAt!,
        properties:
          input.properties?.map(({ id, text }) => ({
            property: { id },
            text: text!,
          })) ?? [],
      },
    }),
    update: (cache, { data }, { variables }) => {
      cache.updateFragment(
        {
          id: `Language:${variables!.input.languageId}`,
          fragment: LanguageWordsFragmentDoc,
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

export function updateWordMutation(): CreateMutationResult<
  typeof UpdateWordDocument
> {
  return createMutation(UpdateWordDocument, {
    optimisticResponse: ({ input }) => ({
      updateWord: {
        ...readWordFull(input.id)!,
        ...(input.original && { name: input.original }),
        ...(input.translation && { name: input.translation }),
        ...(input.properties && {
          properties: input.properties.map(({ id, text }) => ({
            property: { id },
            text: text!,
          })),
        }),
      },
    }),
  });
}

export function deleteWordMutation(): CreateMutationResult<
  typeof DeleteWordDocument
> {
  return createMutation(DeleteWordDocument, {
    optimisticResponse: ({ id }) => ({
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

function readProperty(id: string): PropertyFieldsFragment | null {
  return cache.readFragment({
    id: `Property:${id}`,
    fragment: PropertyFieldsFragmentDoc,
  })!;
}

function readWordFull(id: string): WordFieldsFullFragment | null {
  return cache.readFragment({
    id: `Word:${id}`,
    fragment: WordFieldsFullFragmentDoc,
  })!;
}
