import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { isGraphQlRequest, handleGraphQlRequest } from './sw/graphql';
//import { ServiceWorkerMessage, ServiceWorkerMessageType } from './sw/messages';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
clientsClaim();

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  if (isGraphQlRequest(event.request)) {
    event.respondWith(handleGraphQlRequest(event));
  }
});

self.addEventListener('message', (event) => {
  console.log('message', event.data);
});

self.addEventListener('periodicsync', (e) => {
  const event = e as ExtendableEvent & { tag: string };
  if (event.tag === 'sync-mova-data') {
    console.log('periodic data sync');
    //event.waitUntil(syncMovaData());
  }
});

// async function postMessage(message: ServiceWorkerMessage): Promise<void> {
//   for (const client of await self.clients.matchAll()) {
//     client.postMessage(message);
//   }
// }
