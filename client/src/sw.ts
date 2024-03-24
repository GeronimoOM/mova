import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { isGraphqlRequest, handleGraphQlRequest } from './sw/worker/graphql';
import { sync } from './sw/worker/sync';
import { init } from './sw/worker/init';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
self.skipWaiting();
clientsClaim();

registerRoute(
  ({ url }) => isGraphqlRequest(url),
  ({ event }) => handleGraphQlRequest(event as FetchEvent),
  'POST',
);

self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  if (event.data === 'init') {
    event.waitUntil(init());
  }

  if (event.data === 'sync') {
    event.waitUntil(sync());
  }
});

self.addEventListener('periodicsync', (e) => {
  const event = e as ExtendableEvent & { tag: string };
  if (event.tag === 'sync-mova-data') {
    console.log('Periodic data sync...');
    event.waitUntil(sync());
  }
});
