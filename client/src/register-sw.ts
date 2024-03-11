import { ServiceWorkerMessageHandler } from './sw/messages';

const PERIODIC_SYNC_INTERVAL_MS = 60 * 1000;
const PERIODIC_BACKGROUND_SYNC_INTERVAL_MS = 30 * 60 * 1000;

export type RegisterServiceWorkerOptions = {
  onMessage: ServiceWorkerMessageHandler;
};

export async function registerServiceWorker({
  onMessage,
}: RegisterServiceWorkerOptions) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      await navigator.serviceWorker.register(
        import.meta.env.MODE === 'production' ? '/sw.js' : '/dev-sw.js?dev-sw',
        { scope: '/', type: 'module' },
      );

      registerMessageListener(onMessage);

      sendMessageToServiceWorker('sync');
      setInterval(() => {
        sendMessageToServiceWorker('sync');
      }, PERIODIC_SYNC_INTERVAL_MS);

      await registerBackgroundSync();
    });
  }
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

async function registerMessageListener(onMessage: ServiceWorkerMessageHandler) {
  navigator.serviceWorker.addEventListener('message', (e) => onMessage(e.data));
}

export async function sendMessageToServiceWorker(message: string) {
  const serviceWorker = await getServiceWorker();
  serviceWorker?.postMessage(message);
}

export async function getServiceWorker(): Promise<ServiceWorker | null> {
  const registration = await navigator.serviceWorker?.ready;
  return registration?.active;
}
