/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { CACHE_RESOURCES, FILES_TO_CACHE } from '../env';
import { serviceWorkerLifecycle } from '../data.svelte';

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('install', (event: ExtendableEvent) => {
	serviceWorkerLifecycle.set('installing');
	console.log('Service Worker: Installing');

	sw.skipWaiting();

	const addFilesToCache = async () => {
		const cache = await caches.open(CACHE_RESOURCES);
		await cache.addAll(FILES_TO_CACHE);
	};
	console.log('Install');

	event.waitUntil(addFilesToCache());
	event.waitUntil(new Promise((resolve) => setTimeout(resolve, 5000)));
});
