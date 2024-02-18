import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { isGraphQlRequest, handleGraphQlRequest } from './sw/graphql';
//import { ServiceWorkerMessage, ServiceWorkerMessageType } from './sw/messages';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

self.addEventListener('fetch', (event) => {
  if (isGraphQlRequest(event.request)) {
    event.respondWith(handleGraphQlRequest(event));
  }
});

// self.addEventListener('periodicsync', (e) => {
//   const event = e as ExtendableEvent & { tag: string };
//   if (event.tag === 'sync-mova-data') {
//     event.waitUntil(syncMovaData());
//   }
// });

self.skipWaiting();
clientsClaim();

// async function postMessage(message: ServiceWorkerMessage): Promise<void> {
//   for (const client of await self.clients.matchAll()) {
//     client.postMessage(message);
//   }
// }
