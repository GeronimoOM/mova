import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { isGraphqlRequest, handleGraphQlRequest } from './sw/worker/graphql';
import { sync } from './sw/worker/sync';
import { init } from './sw/worker/init';
import { SwClientMessage, SwClientMessageType } from './sw/client/messages';

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
  const message = event.data as SwClientMessage;
  if (message.type === SwClientMessageType.Initialize) {
    event.waitUntil(init(message.token));
  } else if (message.type === SwClientMessageType.Sync) {
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
