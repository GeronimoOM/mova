import { ApolloClient } from '@merged/solid-apollo';
import { ApolloLink, HttpLink } from '@apollo/client/core';
import { cache } from './cache';

export const GRAPHQL_URI = `/api/graphql`;

let clientId: string | undefined;

export function setClientId(id: string): void {
  clientId = id;
}

const httpLink = new HttpLink({
  uri: GRAPHQL_URI,
});

const headersLink = new ApolloLink((operation, forward) => {
  operation.setContext(() => ({
    headers: {
      'Sync-Client-ID': clientId,
    },
  }));
  return forward(operation);
});

export const client = new ApolloClient({
  link: headersLink.concat(httpLink),
  cache,
  connectToDevTools: true,
});
