import { ApolloClient, InMemoryCache } from '@merged/solid-apollo';
import { WordPage } from './types/graphql';

export const GRAPHQL_URI = 'http://localhost:9000/graphql';

const cache = new InMemoryCache({
  typePolicies: {
    Language: {
      fields: {
        words: {
          keyArgs: ['partOfSpeech', 'query', 'topic'],
          merge(existing: WordPage | undefined, incoming: WordPage) {
            return {
              items: [...(existing?.items ?? []), ...incoming.items],
              hasMore: incoming.hasMore,
            };
          },
        },
      },
    },
  },
});

export const client = new ApolloClient({
  uri: GRAPHQL_URI,
  cache,
  connectToDevTools: true,
});
