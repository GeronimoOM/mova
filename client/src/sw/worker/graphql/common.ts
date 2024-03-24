export type GraphQlRequest<TVariables = Record<string, unknown>> = {
  operationName: string;
  variables: TVariables;
};

export async function tryFetch(event: FetchEvent): Promise<Response> {
  const response = await fetch(event.request);
  if (response.status >= 500) {
    throw new Error('Server error');
  }
  return response;
}

export function response<R>(data: R): Response {
  return new Response(JSON.stringify({ data }), {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
