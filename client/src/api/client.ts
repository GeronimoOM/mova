import { ApolloClient } from '@merged/solid-apollo';
import { cache } from './cache';

export const GRAPHQL_URI = `/api/graphql`;

let clientId: string | undefined;

export function setClientId(id: string): void {
  clientId = id;
}

export const client = new ApolloClient({
  uri: GRAPHQL_URI,
  cache,
  connectToDevTools: true,
  headers: {
    ...(clientId && {
      'Sync-Client-ID': clientId,
    }),
  },
});
