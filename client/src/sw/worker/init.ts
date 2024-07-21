import * as cache from './cache';
import { SwWorkerMessageType, sendMessageToClient } from './messages';

export async function init(token: string): Promise<void> {
  await cache.saveToken(token);

  await sendMessageToClient({
    type: SwWorkerMessageType.Initialized,
    clientId: (await cache.getState()).clientId,
  });
}
