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
export const clearTemporarySeriesData = async (seriesId: string) => {
	console.log('Clearing temporary series data...');
	const temp_cache = await caches.open(CACHE_TEMPORARY);
	const keys = await temp_cache.keys();
	const seriesKeys = keys.filter(
		(key) => key.url.includes('/app/v2/series/') && key.url.includes(seriesId),
	);
	await Promise.all(seriesKeys.map((key) => temp_cache.delete(key)));
};
export const clearTemporaryCaches = async () => {
	console.log('Clearing temporary caches...');
	await caches.delete(CACHE_TEMPORARY);
};
