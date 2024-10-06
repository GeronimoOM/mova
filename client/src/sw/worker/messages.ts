export type SwWorkerMessage =
  | WorkerInitializedMessage
  | WorkerSyncingMessage
  | WorkerSyncOverMessage;

export interface BaseSwWorkerMessage {
  type: SwWorkerMessageType;
}

export enum SwWorkerMessageType {
  Initialized = 'initialized',
  Syncing = 'syncing',
  SyncOver = 'sync_over',
}

export interface WorkerInitializedMessage extends BaseSwWorkerMessage {
  type: SwWorkerMessageType.Initialized;
  clientId: string;
}

export interface WorkerSyncingMessage extends BaseSwWorkerMessage {
  type: SwWorkerMessageType.Syncing;
}

export interface WorkerSyncOverMessage extends BaseSwWorkerMessage {
  type: SwWorkerMessageType.SyncOver;
  isSuccess: boolean;
  hasChanges: boolean;
}

export type SwWorkerMessageHandler = (message: SwWorkerMessage) => void;

export async function sendMessageToClient(
  message: SwWorkerMessage,
): Promise<void> {
  for (const client of await (
    self as unknown as ServiceWorkerGlobalScope
  ).clients.matchAll()) {
    client.postMessage(message);
  }
}
