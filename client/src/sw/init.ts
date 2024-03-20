import { ServiceWorkerMessageType, produceMessage } from './messages';
import * as cache from './cache';

export async function init(): Promise<void> {
  await produceMessage({
    type: ServiceWorkerMessageType.InitMessage,
    clientId: (await cache.getState()).clientId,
  });
}
