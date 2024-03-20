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
  PartOfSpeech,
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

export function createPropertyMutation(): CreateMutationResult<
  typeof CreatePropertyDocument
> {
  return createMutation(CreatePropertyDocument, {
    optimisticResponse: ({ input }) => {
      const properties = readPartOfSpeechProperties(
        input.languageId,
        input.partOfSpeech,
      );
      const order = properties.length + 1;

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

export function deletePropertyMutation(): CreateMutationResult<
  typeof DeletePropertyDocument
> {
  return createMutation(DeletePropertyDocument, {
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

export function updateWordMutation(): CreateMutationResult<
  typeof UpdateWordDocument
> {
  return createMutation(UpdateWordDocument, {
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

export function deleteWordMutation(): CreateMutationResult<
  typeof DeleteWordDocument
> {
  return createMutation(DeleteWordDocument, {
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
): { id: string }[] {
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
