/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { serviceWorkerLifecycle } from '../data.js';

const sw = self as unknown as ServiceWorkerGlobalScope;

import { isDynamicCacheMessage, isStatusMessage } from '$lib/types/broadcastMessageTypes';
import { addItemToCache, resetCache } from '../cacheFile';

export const broadcastChannel = new BroadcastChannel('serviceWorker');

export const sendMessage = (data: unknown) => {
	console.log('Sending message: ', data);
	broadcastChannel.postMessage(data);
};
export const respondToMessage = (prev: unknown, res: unknown) => {
	sendMessage({ prev, res });
};

broadcastChannel.onmessage = async (e: MessageEvent) => {
	if (!e.data) {
		return;
	}

	if (isDynamicCacheMessage(e.data)) {
		if (e.data.action === 'reset') {
			await resetCache();
		} else if (e.data.action === 'add') {
			await addItemToCache(e.data.requestInfo);
		}
		return;
	}

	if (isStatusMessage(e.data)) {
		console.log(serviceWorkerLifecycle.value);
		// if another service worker is installing, let it handle the message
		if (
			sw.registration.installing &&
			!['installing', 'activating'].includes(sw.serviceWorker.state)
		) {
			console.debug('Another is installing, let it handle it');
			return;
		}
		respondToMessage(e.data, { status: serviceWorkerLifecycle.value });
	}
};
