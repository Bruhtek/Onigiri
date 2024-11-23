/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

import { build, files, version, prerendered } from '$service-worker';

const CACHE_RESOURCES = `cache-resources-${version}`;
const CACHE_IMAGES_CDN = `cache-images`;

const ASSETS = [...build, ...files];
const FILES_TO_CACHE = [...ASSETS, ...prerendered];

sw.addEventListener('install', (event: ExtendableEvent) => {
	const addFilesToCache = async () => {
		const cache = await caches.open(CACHE_RESOURCES);
		await cache.addAll(FILES_TO_CACHE);
	};
	console.log('Install');

	event.waitUntil(addFilesToCache());
});

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
	console.log(prerendered);

	event.waitUntil(deleteOldCaches());
});

sw.addEventListener('fetch', (event: FetchEvent) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	const url = new URL(event.request.url);
	console.log('Fetch', url);

	// special url, so that we are able to intercept connectivity requests, doesnt do anything rn, but will soon
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
				console.log('CDN cached');
				return res;
			}
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			// if we're offline, fetch can return a value that is not a Response
			// instead of throwing - and we can't pass this non-Response to respondWith
			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			console.log('res', response.status);

			if (url.hostname == 'cdn.j-novel.club' && (response.ok || response.status === 0)) {
				console.log('Caching');
				await images_cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const response = await resource_cache.match(event.request);

			if (response) {
				return response;
			}

			// if there's no cache, then just error out
			// as there is nothing we can do to respond to this request
			throw err;
		}
	}

	event.respondWith(respond());
});
