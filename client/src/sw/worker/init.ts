import { SwWorkerMessageType, sendMessageToClient } from './messages';
import * as cache from './cache';

export async function init(): Promise<void> {
  await sendMessageToClient({
    type: SwWorkerMessageType.Initialized,
    clientId: (await cache.getState()).clientId,
  });
}
