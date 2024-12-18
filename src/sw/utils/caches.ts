/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { CACHE_DYNAMIC, CACHE_IMAGES_CDN, CACHE_RESOURCES, CACHE_TEMPORARY } from '../env';

const sw = self as unknown as ServiceWorkerGlobalScope;

export const clearAllCaches = async () => {
	console.log('Clearing all caches...');
	await caches.delete(CACHE_DYNAMIC);
	await caches.delete(CACHE_IMAGES_CDN);
	await caches.delete(CACHE_RESOURCES);
	await caches.delete(CACHE_TEMPORARY);

	return await sw.registration.unregister();
};
export const clearTemporaryCaches = async () => {
	console.log('Clearing temporary caches...');
	await caches.delete(CACHE_TEMPORARY);
};
