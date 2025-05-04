import { SwWorkerMessageHandler } from '../worker/messages';
import { SwClientMessageType, sendMessageToServiceWorker } from './messages';

const PERIODIC_SYNC_INTERVAL_MS = 120 * 1000;
// const PERIODIC_BACKGROUND_SYNC_INTERVAL_MS = 30 * 60 * 1000;
let periodicSyncInterval: NodeJS.Timeout | null = null;

export function registerServiceWorker(
  messageHandler: SwWorkerMessageHandler,
): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      registerSwMessageHandler(messageHandler);

      navigator.serviceWorker.register(
        import.meta.env.MODE === 'production' ? '/sw.js' : '/dev-sw.js?dev-sw',
        { scope: '/', type: 'module' },
      );
    });
  }
}

export function initServiceWorker(token: string) {
  sendMessageToServiceWorker({
    type: SwClientMessageType.Initialize,
    token,
  });
  startPeriodicSync();
  // registerBackgroundSync();
}

export function resetServiceWorker() {
  sendMessageToServiceWorker({
    type: SwClientMessageType.Destroy,
  });

  if (periodicSyncInterval) {
    clearInterval(periodicSyncInterval);
  }
}

export async function isServiceWorkerRegistered() {
  const registrations = await navigator.serviceWorker?.getRegistrations();

  return Boolean(registrations.length);
}

export function registerSwMessageHandler(
  messageHandler: SwWorkerMessageHandler,
) {
  const handler = (e: MessageEvent) => {
    messageHandler(e.data);
  };

  navigator.serviceWorker?.addEventListener('message', handler);

  return () => navigator.serviceWorker?.removeEventListener('message', handler);
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
