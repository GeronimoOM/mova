export type ServiceWorkerMessage = GqlEntityServiceWorkerMessage;

export interface BaseServiceWorkerMessage {
  type: ServiceWorkerMessageType;
}

export enum ServiceWorkerMessageType {
  GqlEntityMessage = 'GqlEntityMessage',
}

export interface GqlEntityServiceWorkerMessage
  extends BaseServiceWorkerMessage {
  type: ServiceWorkerMessageType.GqlEntityMessage;
  data: 'entity';
}

export type ServiceWorkerMessageHandler = (
  message: ServiceWorkerMessage,
) => void;
