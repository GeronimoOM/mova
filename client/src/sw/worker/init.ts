import * as cache from './cache';
import { SwWorkerMessageType, sendMessageToClient } from './messages';

export async function init(token: string): Promise<void> {
  await cache.initState(token);
  const state = await cache.getState();

  await sendMessageToClient({
    type: SwWorkerMessageType.Initialized,
    clientId: state.clientId,
  });
}

export async function destroy(): Promise<void> {
  await cache.destroy();
}
