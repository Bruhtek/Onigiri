/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { ASSETS, CACHE_IMAGES_CDN, CACHE_RESOURCES, FILES_TO_CACHE } from '../env';
import tryDynamicCache from '../cacheFile';

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('fetch', (event: FetchEvent) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	const url = new URL(event.request.url);
	// special url, so that we are able to intercept connectivity requests, doesnt do anything rn
	if (url.pathname == '/app/v2/status') {
		console.log('STATUS!');
		const res = new Response(JSON.stringify({ online: true }));
		event.respondWith(res);
		return;
	}

	async function respond() {
		const url = new URL(event.request.url);
		const resource_cache = await caches.open(CACHE_RESOURCES);
		const images_cache = await caches.open(CACHE_IMAGES_CDN);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			const response = await resource_cache.match(url.pathname);

			if (response) {
				return response;
			}
		}

		if (url.hostname == 'cdn.j-novel.club') {
			const res = await images_cache.match(event.request);

			if (res) {
				return res;
			}
		}

		const res = await tryDynamicCache(event.request);
		if (res) {
			return res;
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			// instead of throwing - and we can't pass this non-Response to respondWith
			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			if (url.hostname == 'cdn.j-novel.club' && (response.ok || response.status === 0)) {
				await images_cache.put(event.request, response.clone());
			}

			return response;
		} catch (e) {
			if (FILES_TO_CACHE.includes(url.pathname)) {
				const response = await resource_cache.match(url.pathname);
				if (response) {
					return response;
				}
			}

			throw e;
		}
	}

	event.respondWith(respond());
});
