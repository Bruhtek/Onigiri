/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import {
	ASSETS,
	CACHE_IMAGES_CDN,
	CACHE_RESOURCES,
	CACHE_TEMPORARY,
	FILES_TO_CACHE,
	TEMP_CACHE_HEADER_NAME,
	TEMP_CACHE_REGEXES,
	TEMP_CACHE_TTL,
} from '../env';
import tryDynamicCache from '../cacheFile';

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('fetch', (event: FetchEvent) => {
	// special url, so that we are able to intercept connectivity requests, doesn't do anything rn
	// if (url.pathname == '/app/v2/status') {
	// 	console.log('STATUS!');
	// 	const res = new Response(JSON.stringify({ online: true }));
	// 	event.respondWith(res);
	// 	return;
	// }

	async function respond() {
		const isGet = event.request.method === 'GET';

		const url = new URL(event.request.url);
		const resource_cache = await caches.open(CACHE_RESOURCES);
		const images_cache = await caches.open(CACHE_IMAGES_CDN);
		const temp_cache = await caches.open(CACHE_TEMPORARY);

		for (const regex of TEMP_CACHE_REGEXES) {
			if (url.pathname.match(regex)) {
				console.log(url.pathname, 'Matches regex');
				const res = await temp_cache.match(url.pathname);
				if (res) {
					const ttl = res.headers.get(TEMP_CACHE_HEADER_NAME);
					if (ttl) {
						if (new Date(ttl).getTime() > Date.now()) {
							console.log('Serving temporarily cached data');
							return res;
						} else {
							console.log('Temporarily cached data has expired, deleting');
							await temp_cache.delete(url.pathname);
						}
					}
				}
			}
		}

		if (isGet) {
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

			if (response.ok || response.status === 0) {
				for (const regex of TEMP_CACHE_REGEXES) {
					if (url.pathname.match(regex)) {
						const expires = new Date();
						expires.setSeconds(TEMP_CACHE_TTL);
						console.log(new Date(), expires);

						const cachedFields: {
							status: number;
							statusText: string;
							headers: { [key: string]: string };
						} = {
							status: response.status,
							statusText: response.statusText,
							headers: { [TEMP_CACHE_HEADER_NAME]: expires.toUTCString() },
						};
						response.headers.forEach((v, k) => {
							cachedFields.headers[k] = v;
						});

						const clone = response.clone();
						const toCache = new Response(clone.body, cachedFields);
						await temp_cache.put(url.pathname, toCache);
						console.log(
							`Caching ${event.request.url} temporarily until ${expires.toUTCString()}`,
						);
					}
				}
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
