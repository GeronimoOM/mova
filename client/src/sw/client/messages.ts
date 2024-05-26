export type SwClientMessage = ClientInitializeMessage | ClientSyncMessage;

export interface BaseSwClientMessage {
  type: SwClientMessageType;
}

export enum SwClientMessageType {
  Initialize = 'initialize',
  Sync = 'sync',
}

export interface ClientInitializeMessage extends BaseSwClientMessage {
  type: SwClientMessageType.Initialize;
  token: string;
}

export interface ClientSyncMessage extends BaseSwClientMessage {
  type: SwClientMessageType.Sync;
}

export type SwClientMessageHandler = (message: SwClientMessage) => void;

export async function sendMessageToServiceWorker(message: SwClientMessage) {
  const registration = await navigator.serviceWorker?.ready;
  const serviceWorker = registration?.active;

  serviceWorker?.postMessage(message);
}
