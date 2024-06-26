import { ApolloClient } from '@merged/solid-apollo';
import { ApolloLink, HttpLink } from '@apollo/client/core';
import { cache } from './cache';
import { LOCAL_STORAGE_TOKEN_KEY } from '../components/AuthContext';

export const GRAPHQL_URI = `/api/graphql`;

let clientId: string | undefined;

export function setClientId(id: string): void {
  clientId = id;
}

const httpLink = new HttpLink({
  uri: GRAPHQL_URI,
});

const headersLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

  operation.setContext(() => ({
    headers: {
      'Sync-Client-ID': clientId,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  }));
  return forward(operation);
});

export const client = new ApolloClient({
  link: headersLink.concat(httpLink),
  cache,
  connectToDevTools: true,
});
