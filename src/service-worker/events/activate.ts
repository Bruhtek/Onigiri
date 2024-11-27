/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { CACHE_RESOURCES } from '../env';

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('activate', (event: ExtendableEvent) => {
	// Remove previous cached data from disk
	const deleteOldCaches = async () => {
		for (const key of await caches.keys()) {
			if (key.startsWith('cache-resources-') && key !== CACHE_RESOURCES) {
				await caches.delete(key);
			}
		}
	};

	console.log('Activate');

	event.waitUntil(deleteOldCaches());
});
