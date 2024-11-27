export const broadcastChannel = new BroadcastChannel('serviceWorker');

export const sendBroadcastMessage = (data: unknown) => {
	broadcastChannel.postMessage(data);
};
