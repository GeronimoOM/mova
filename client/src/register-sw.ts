import { ServiceWorkerMessageHandler } from './sw/messages';

export type RegisterServiceWorkerOptions = {
  onMessage: ServiceWorkerMessageHandler;
};

export async function registerServiceWorker({
  onMessage,
}: RegisterServiceWorkerOptions) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async function () {
      navigator.serviceWorker.register(
        import.meta.env.MODE === 'production' ? '/sw.js' : '/dev-sw.js?dev-sw',
        { scope: '/', type: 'module' },
      );
    });

    // const registration = await window.navigator.serviceWorker.ready;
    // try {
    //   await registration.periodicSync.register('sync-mova-data', {
    //     minInterval: 1 * 60 * 60 * 1000,
    //   });
    // } catch (err) {
    //   console.log(err, 'Periodic sync could not be registered!');
    // }

    navigator.serviceWorker.addEventListener('message', (e) =>
      onMessage(e.data),
    );
  }
}

export async function getServiceWorker(): Promise<ServiceWorker | null> {
  const registration = await navigator.serviceWorker?.ready;
  return registration.active;
}
