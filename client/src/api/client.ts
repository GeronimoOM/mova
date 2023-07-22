import { ApolloClient, InMemoryCache } from '@merged/solid-apollo';
import { TypePolicy } from '@apollo/client';
import { LanguageWordsArgs, WordPage } from './types/graphql';

export const GRAPHQL_URI = `${import.meta.env.VITE_API_URL}/graphql`;

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
          hasMore: incoming.hasMore,
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

export const client = new ApolloClient({
  uri: GRAPHQL_URI,
  cache,
  connectToDevTools: true,
});
