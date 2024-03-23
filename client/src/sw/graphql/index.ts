import { GraphQlRequest } from './common';
import { handleGraphQlMutation, isGraphQlMutation } from './mutations';
import { handleGraphQlQuery, isGraphQlQuery } from './queries';

export function isGraphqlRequest(url: URL): boolean {
  return url.pathname === '/api/graphql';
}

export async function handleGraphQlRequest(
  event: FetchEvent,
): Promise<Response> {
  const request = await getGraphQlRequest(event);
  if (isGraphQlQuery(request)) {
    return handleGraphQlQuery(event, request);
  } else if (isGraphQlMutation(request)) {
    return handleGraphQlMutation(event, request);
  } else {
    return fetch(event.request);
  }
}

export async function getGraphQlRequest(
  event: FetchEvent,
): Promise<GraphQlRequest> {
  return await event.request.clone().json();
}
