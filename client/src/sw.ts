import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { matchGraphqlRequest, handleGraphQlRequest } from './sw/graphql-route';
import { sync } from './sw/sync';
//import { ServiceWorkerMessage, ServiceWorkerMessageType } from './sw/messages';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
self.skipWaiting();
clientsClaim();

registerRoute(
  ({ url }) => matchGraphqlRequest(url),
  ({ event }) => handleGraphQlRequest(event as FetchEvent),
  'POST',
);

self.addEventListener('message', (event) => {
  console.log('message', event.data);
  if (event.data === 'sync') {
    event.waitUntil(sync());
  }
});

self.addEventListener('periodicsync', (e) => {
  const event = e as ExtendableEvent & { tag: string };
  if (event.tag === 'sync-mova-data') {
    console.log('periodic data sync');
    //event.waitUntil(syncMovaData());
  }
});
