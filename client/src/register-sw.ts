import { setClientId } from './api/client';
import { ServiceWorkerMessage, ServiceWorkerMessageType } from './sw/messages';

const PERIODIC_SYNC_INTERVAL_MS = 60 * 1000;
const PERIODIC_BACKGROUND_SYNC_INTERVAL_MS = 30 * 60 * 1000;

let periodicSyncInterval: ReturnType<typeof setInterval> | undefined;

export async function registerServiceWorker(): Promise<void> {
  return new Promise((resolve) => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        await navigator.serviceWorker.register(
          import.meta.env.MODE === 'production'
            ? '/sw.js'
            : '/dev-sw.js?dev-sw',
          { scope: '/', type: 'module' },
        );

        registerMessageListener();
        await sendMessageToServiceWorker('init');
        resolve();

        startPeriodicSync();

        await registerBackgroundSync();
      });
    } else {
      resolve();
    }
  });
}

export function startPeriodicSync() {
  if (periodicSyncInterval) {
    return;
  }

  sendMessageToServiceWorker('sync');
  periodicSyncInterval = setInterval(() => {
    sendMessageToServiceWorker('sync');
  }, PERIODIC_SYNC_INTERVAL_MS);
}

export function stopPeriodicSync() {
  if (!periodicSyncInterval) {
    return;
  }

  clearInterval(periodicSyncInterval);
}

async function registerBackgroundSync() {
  const perioricBgSyncStatus = await navigator.permissions.query({
    name: 'periodic-background-sync' as PermissionName,
  });

  if (perioricBgSyncStatus.state === 'granted') {
    const registration = await window.navigator.serviceWorker.ready;
    try {
      await registration.periodicSync.register('sync-mova-data', {
        minInterval: PERIODIC_BACKGROUND_SYNC_INTERVAL_MS,
      });
    } catch (err) {
      console.log(err, 'Periodic sync could not be registered!');
    }
  }
}

async function registerMessageListener() {
  navigator.serviceWorker.addEventListener('message', (e) => {
    const message: ServiceWorkerMessage = e.data;

    if (message.type === ServiceWorkerMessageType.InitMessage) {
      setClientId(message.clientId);
    }
  });
}

export async function sendMessageToServiceWorker(message: string) {
  const serviceWorker = await getServiceWorker();
  serviceWorker?.postMessage(message);
}

export async function getServiceWorker(): Promise<ServiceWorker | null> {
  const registration = await navigator.serviceWorker?.ready;
  return registration?.active;
}
