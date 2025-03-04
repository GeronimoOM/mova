import { SwWorkerMessageHandler } from '../worker/messages';
import { SwClientMessageType, sendMessageToServiceWorker } from './messages';

const PERIODIC_SYNC_INTERVAL_MS = 120 * 1000;
// const PERIODIC_BACKGROUND_SYNC_INTERVAL_MS = 30 * 60 * 1000;
let periodicSyncInterval: number | null = null;

export async function registerServiceWorker(
  messageHandler: SwWorkerMessageHandler,
): Promise<void> {
  return new Promise((resolve) => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        await navigator.serviceWorker.register(
          import.meta.env.MODE === 'production'
            ? '/sw.js'
            : '/dev-sw.js?dev-sw',
          { scope: '/', type: 'module' },
        );

        registerMessageHandler(messageHandler);

        resolve();
      });
    } else {
      resolve();
    }
  });
}

export async function initServiceWorker(token: string) {
  sendMessageToServiceWorker({
    type: SwClientMessageType.Initialize,
    token,
  });
  startPeriodicSync();
  // registerBackgroundSync();
}

export async function resetServiceWorker() {
  sendMessageToServiceWorker({
    type: SwClientMessageType.Destroy,
  });

  if (periodicSyncInterval) {
    clearInterval(periodicSyncInterval);
  }
}

function startPeriodicSync() {
  sendMessageToServiceWorker({
    type: SwClientMessageType.Sync,
  });
  periodicSyncInterval = setInterval(() => {
    sendMessageToServiceWorker({
      type: SwClientMessageType.Sync,
    });
  }, PERIODIC_SYNC_INTERVAL_MS);

  window.addEventListener('online', () => {
    sendMessageToServiceWorker({
      type: SwClientMessageType.Sync,
    });
  });
}

// async function registerBackgroundSync() {
//   const perioricBgSyncStatus = await navigator.permissions.query({
//     name: 'periodic-background-sync' as PermissionName,
//   });

//   if (perioricBgSyncStatus.state === 'granted') {
//     const registration = await window.navigator.serviceWorker.ready;
//     try {
//       await registration.periodicSync.register('sync-mova-data', {
//         minInterval: PERIODIC_BACKGROUND_SYNC_INTERVAL_MS,
//       });
//     } catch (err) {
//       console.log(err, 'Periodic sync could not be registered!');
//     }
//   }
// }

async function registerMessageHandler(messageHandler: SwWorkerMessageHandler) {
  navigator.serviceWorker.addEventListener('message', (e) => {
    messageHandler(e.data);
  });
}
