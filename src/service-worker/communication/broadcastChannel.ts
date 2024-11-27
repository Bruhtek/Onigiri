/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { isDynamicCacheMessage } from '../../lib/types/broadcastMessageTypes';
import { addItemToCache, resetCache } from '../cacheFile';

export const broadcastChannel = new BroadcastChannel('serviceWorker');

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
	}
};
