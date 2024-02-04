import { TypePolicy } from '@apollo/client';
import { InMemoryCache } from '@merged/solid-apollo';
import { LanguageWordsArgs, WordPage } from './types/graphql';

const languageTypePolicy: TypePolicy = {
  fields: {
    words: {
      keyArgs: (args: LanguageWordsArgs | null) => {
        return args?.query ||
          args?.partsOfSpeech?.length ||
          args?.topics?.length
          ? 'search'
          : false;
      },
      merge(existing: WordPage | undefined, incoming: WordPage): WordPage {
        return {
          items: [...(existing?.items ?? []), ...incoming.items],
          nextCursor: incoming.nextCursor,
        };
      },
    },
  },
};

export const cache = new InMemoryCache({
  typePolicies: {
    Language: languageTypePolicy,
  },
});
