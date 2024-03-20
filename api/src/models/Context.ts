export interface Context {
  clientId?: string;
}

export function emptyContext(): Context {
  return {};
}
