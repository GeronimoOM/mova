import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  ServerError,
} from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { AppRoute } from '../routes';
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

const errorLink = new ErrorLink(({ error }) => {
  if (ServerError.is(error) && error.statusCode === 401) {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    window.location.replace(AppRoute.Default);
  }
});

const headersLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

  operation.setContext(() => ({
    headers: {
      'Sync-Client-ID': clientId,
      'Client-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...('Cypress' in window && { 'X-Sort-Exercises': 'true' }),
    },
  }));
  return forward(operation);
});

export const client = new ApolloClient({
  link: errorLink.concat(headersLink).concat(httpLink),
  cache,
  devtools: {
    enabled: true,
  },
});
