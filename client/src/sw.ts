import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
//import { ServiceWorkerMessage, ServiceWorkerMessageType } from './sw/messages';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// self.addEventListener('fetch', (event) => {
//   event.waitUntil((async () => {
//     const requestClone = event.request.clone();
//     const response = await fetch(event.request);

//     if (isGraphQlRequest(event.request)) {
//       console.log(await requestClone.json());
//       console.log(await response.clone().json());
//     }

//     return response;
//   })());
// });

self.addEventListener('periodicsync', (e) => {
  const event = e as ExtendableEvent & { tag: string };
  if (event.tag === 'sync-mova-data') {
    event.waitUntil(syncMovaData());
  }
});

self.skipWaiting();
clientsClaim();

// async function postMessage(message: ServiceWorkerMessage): Promise<void> {
//   for (const client of await self.clients.matchAll()) {
//     client.postMessage(message);
//   }
// }

async function syncMovaData() {
  // await postMessage({
  //   type: ServiceWorkerMessageType.GqlEntityMessage,
  //   data: 'entity',
  // });
}

// function isGraphQlRequest(request: Request): boolean {
//   return (new URL(request.url)).pathname === '/api/graphql';
// }
