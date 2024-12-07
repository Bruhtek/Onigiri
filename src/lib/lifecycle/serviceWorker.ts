export const broadcastChannel = new BroadcastChannel('serviceWorker');

export const sendBroadcastMessage = (data: unknown) => {
	broadcastChannel.postMessage(data);
};

export const broadcastWithResponse = async (data: unknown, timeout: number = 200) => {
	return new Promise((resolve, reject) => {
		const onMessage = (e: MessageEvent) => {
			if (
				!e.data ||
				typeof e.data !== 'object' ||
				!e.data.prev ||
				JSON.stringify(e.data.prev) !== JSON.stringify(data)
			) {
				return;
			}

			broadcastChannel.removeEventListener('message', onMessage);
			clearTimeout(timer);
			resolve(e.data.res);
		};

		const timer = setTimeout(() => {
			broadcastChannel.removeEventListener('message', onMessage);
			reject(new Error('Timeout waiting for response'));
		}, timeout);

		broadcastChannel.addEventListener('message', onMessage);
		broadcastChannel.postMessage(data);
	});
};
