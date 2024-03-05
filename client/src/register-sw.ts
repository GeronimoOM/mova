import { ServiceWorkerMessageHandler } from './sw/messages';

const PERIODIC_SYNC_INTERVAL_S = 30 * 60;

export type RegisterServiceWorkerOptions = {
  onMessage: ServiceWorkerMessageHandler;
};

export async function registerServiceWorker({
  onMessage,
}: RegisterServiceWorkerOptions) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      navigator.serviceWorker.register(
        import.meta.env.MODE === 'production' ? '/sw.js' : '/dev-sw.js?dev-sw',
        { scope: '/', type: 'module' },
      );

      const perioricBgSyncStatus = await navigator.permissions.query({
        name: 'periodic-background-sync' as PermissionName,
      });
      if (perioricBgSyncStatus.state === 'granted') {
        const registration = await window.navigator.serviceWorker.ready;
        try {
          await registration.periodicSync.register('sync-mova-data', {
            minInterval: PERIODIC_SYNC_INTERVAL_S * 1000,
          });
        } catch (err) {
          console.log(err, 'Periodic sync could not be registered!');
        }
      }
    });

    navigator.serviceWorker.addEventListener('message', (e) =>
      onMessage(e.data),
    );
  }
}

export async function sendServiceWorkerMessage() {
  const serviceWorker = await getServiceWorker();
  serviceWorker?.postMessage('test');
}

export async function getServiceWorker(): Promise<ServiceWorker | null> {
  const registration = await navigator.serviceWorker?.ready;
  return registration.active;
}
