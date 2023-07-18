import {
  ApolloCache,
  MutationUpdaterFunction as ApolloMutationUpdaterFunction,
  DefaultContext,
  TypedDocumentNode,
} from '@apollo/client';
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
  ReorderPropertiesDocument,
} from './types/graphql';

type MutationUpdaterFunction<MDocument> = MDocument extends TypedDocumentNode<
  infer MResult,
  infer MVariables
>
  ? ApolloMutationUpdaterFunction<
      MResult,
      MVariables,
      DefaultContext,
      ApolloCache<any>
    >
  : never;

export const updateCacheOnCreateLanguage: MutationUpdaterFunction<
  typeof CreateLanguageDocument
> = (cache, { data }) => {
  cache.updateQuery(
    {
      query: GetLanguagesDocument,
      overwrite: true,
    },
    (query) => ({
      languages: [...(query?.languages ?? []), data!.createLanguage],
    }),
  );
};

export const updateCacheOnDeleteLanguage: MutationUpdaterFunction<
  typeof DeleteLanguageDocument
> = (cache, { data }) => {
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
};

export const updateCacheOnCreateProperty: MutationUpdaterFunction<
  typeof CreatePropertyDocument
> = (cache, { data }, { variables }) => {
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
};

export const updateCacheOnDeleteProperty: MutationUpdaterFunction<
  typeof DeletePropertyDocument
> = (cache, { data }) => {
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
};

export const updateCacheOnReorderProperties: MutationUpdaterFunction<
  typeof ReorderPropertiesDocument
> = (cache, { data }, { variables }) => {
  cache.writeFragment({
    id: `Language:${variables!.input.languageId}`,
    fragment: LanguagePropertiesFragmentDoc,
    variables: { partOfSpeech: variables!.input.partOfSpeech },
    overwrite: true,
    data: { properties: data!.reorderProperties },
  });
};

export const updateCacheOnCreateWord: MutationUpdaterFunction<
  typeof CreateWordDocument
> = (cache, { data }, { variables }) => {
  cache.updateFragment(
    {
      id: `Language:${variables!.input.languageId}`,
      fragment: LanguageWordsFragmentDoc,
      overwrite: true,
    },
    (wordsPage) => ({
      words: {
        items: [data!.createWord, ...(wordsPage?.words.items ?? [])],
        hasMore: wordsPage?.words.hasMore ?? false,
      },
    }),
  );
};

export const updateCacheOnDeleteWord: MutationUpdaterFunction<
  typeof DeleteWordDocument
> = (cache, { data }) => {
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
        hasMore: wordsPage?.words.hasMore ?? false,
      },
    }),
  );
};
