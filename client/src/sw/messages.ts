export type ServiceWorkerMessage = SyncingMessage | SyncingOverMessage;

export interface BaseServiceWorkerMessage {
  type: ServiceWorkerMessageType;
}

export enum ServiceWorkerMessageType {
  Syncing = 'syncing',
  SyncingOver = 'syncing_over',
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
