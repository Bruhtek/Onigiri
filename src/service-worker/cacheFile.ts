/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { CACHE_DYNAMIC } from './env';

export const addItemToCache = async (req: RequestInfo | URL) => {
	console.log('Adding item to cache');

	const cache = await caches.open(CACHE_DYNAMIC);

	try {
		await cache.add(req);
	} catch (err) {
		console.error(err);
	}
};
export const resetCache = async () => {
	await caches.delete(CACHE_DYNAMIC);
};

const tryDynamicCache = async (req: RequestInfo | URL) => {
	const cache = await caches.open(CACHE_DYNAMIC);
	if (!cache) {
		return undefined;
	}
	return cache.match(req);
};

export default tryDynamicCache;
