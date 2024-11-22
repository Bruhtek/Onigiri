import notificationStore from '$lib/stores/notificationStore.svelte';
import { jfetch } from '$lib/api/jnovel.svelte';

const connectivityCheck = (node: Window) => {
	$effect(() => {
		const onBlur = (e: FocusEvent) => {
			// console.log(e);
		};
		const onFocus = (e: FocusEvent) => {
			// console.log(e);
			connectivityCheck();
		};

		const connectivityCheck = () => {
			// jfetch('/status')
			// 	.then(async (res) => {
			// 		console.log(await res.json());
			// 		notificationStore.success('Internet!');
			// 	})
			// 	.catch(() => {
			// 		notificationStore.error('No internet connection!');
			// 	});
		};

		node.addEventListener('load', connectivityCheck);
		node.addEventListener('blur', onBlur);
		node.addEventListener('focus', onFocus);

		return () => {
			node.removeEventListener('blur', onBlur);
			node.removeEventListener('focus', onFocus);
		};
	});
};

export default connectivityCheck;
