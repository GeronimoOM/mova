export type ServiceWorkerMessage =
  | InitMessage
  | SyncingMessage
  | SyncingOverMessage;

export interface BaseServiceWorkerMessage {
  type: ServiceWorkerMessageType;
}

export enum ServiceWorkerMessageType {
  InitMessage = 'init',
  Syncing = 'syncing',
  SyncingOver = 'syncing_over',
}

export interface InitMessage extends BaseServiceWorkerMessage {
  type: ServiceWorkerMessageType.InitMessage;
  clientId: string;
}

export interface SyncingMessage extends BaseServiceWorkerMessage {
  type: ServiceWorkerMessageType.Syncing;
}

export interface SyncingOverMessage extends BaseServiceWorkerMessage {
  type: ServiceWorkerMessageType.SyncingOver;
}

export type ServiceWorkerMessageHandler = (
  message: ServiceWorkerMessage,
) => void;

export async function produceMessage(
  message: ServiceWorkerMessage,
): Promise<void> {
  for (const client of await (
    self as unknown as ServiceWorkerGlobalScope
  ).clients.matchAll()) {
    client.postMessage(message);
  }
}
