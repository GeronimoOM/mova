export type SwClientMessage =
  | ClientInitializeMessage
  | ClientSyncMessage
  | ClientDestroyMessage;

export interface BaseSwClientMessage {
  type: SwClientMessageType;
}

export enum SwClientMessageType {
  Initialize = 'initialize',
  Sync = 'sync',
  Destroy = 'destroy',
}

export interface ClientInitializeMessage extends BaseSwClientMessage {
  type: SwClientMessageType.Initialize;
  token: string;
}

export interface ClientSyncMessage extends BaseSwClientMessage {
  type: SwClientMessageType.Sync;
}

export interface ClientDestroyMessage extends BaseSwClientMessage {
  type: SwClientMessageType.Destroy;
}

export type SwClientMessageHandler = (message: SwClientMessage) => void;

export async function sendMessageToServiceWorker(message: SwClientMessage) {
  const registration = await navigator.serviceWorker?.ready;
  const serviceWorker = registration?.active;

  serviceWorker?.postMessage(message);
}
