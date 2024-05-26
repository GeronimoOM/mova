import { SwWorkerMessageType, sendMessageToClient } from './messages';
import * as cache from './cache';

export async function init(token: string): Promise<void> {
  await cache.saveToken(token);

  await sendMessageToClient({
    type: SwWorkerMessageType.Initialized,
    clientId: (await cache.getState()).clientId,
  });
}
