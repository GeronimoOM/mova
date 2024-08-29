import { ApolloClient, ApolloLink, HttpLink } from '@apollo/client';
import { LOCAL_STORAGE_TOKEN_KEY } from '../utils/constants';
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
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

  operation.setContext(() => ({
    headers: {
      'Sync-Client-ID': clientId,
      'Client-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
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
