import { ApolloClient } from '@merged/solid-apollo';
import { cache } from './cache';

export const GRAPHQL_URI = `/api/graphql`;

export const client = new ApolloClient({
  uri: GRAPHQL_URI,
  cache,
  connectToDevTools: true,
  headers: {
    // 'Sync-Client-ID': '',
  },
});
