import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { SwClientMessage, SwClientMessageType } from './sw/client/messages';
import { handleGraphQlRequest, isGraphqlRequest } from './sw/worker/graphql';
import { destroy, init } from './sw/worker/init';
import { sync } from './sw/worker/sync';

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
  } else if (message.type === SwClientMessageType.Destroy) {
    event.waitUntil(destroy());
  }
});

self.addEventListener('periodicsync', (e) => {
  const event = e as ExtendableEvent & { tag: string };
  if (event.tag === 'sync-mova-data') {
    console.log('Periodic data sync...');
    event.waitUntil(sync());
  }
});
