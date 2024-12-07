/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { CACHE_RESOURCES } from '../env';
import { serviceWorkerLifecycle } from '../data.js';

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('activate', (event: ExtendableEvent) => {
	serviceWorkerLifecycle.set('active');
	console.log('Service Worker: Active');
	// Remove previous cached data from disk
	const deleteOldCaches = async () => {
		for (const key of await caches.keys()) {
			if (key.startsWith('cache-resources-') && key !== CACHE_RESOURCES) {
				await caches.delete(key);
			}
		}
	};

	event.waitUntil(sw.clients.claim());
	event.waitUntil(deleteOldCaches());
});
