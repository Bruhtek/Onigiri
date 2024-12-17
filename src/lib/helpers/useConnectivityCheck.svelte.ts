const connectivityCheck = (node: Window) => {
	$effect(() => {
		const onBlur = () => {
			// console.log(e);
		};
		const onFocus = () => {
			// console.log(e);
			connectivityCheck();
		};

		const connectivityCheck = () => {
			// jfetch('/status')
			// 	.then(async (res) => {
			// 		console.log(await res.json());
			// 		Notifications.success('Internet!');
			// 	})
			// 	.catch(() => {
			// 		Notifications.error('No internet connection!');
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
