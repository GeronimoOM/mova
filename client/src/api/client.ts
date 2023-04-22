import { ApolloClient, InMemoryCache } from '@merged/solid-apollo';

export const GRAPHQL_URI = 'http://localhost:9000/graphql';

export const client = new ApolloClient({
  uri: GRAPHQL_URI,
  cache: new InMemoryCache(),
});
