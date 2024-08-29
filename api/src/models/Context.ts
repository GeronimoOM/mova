export interface Context {
  jwtToken?: string;
  clientId?: string;
  timezone?: string;
}

export function emptyContext(): Context {
  return {};
}
