export interface Context {
  jwtToken?: string;
  clientId?: string;
}

export function emptyContext(): Context {
  return {};
}
