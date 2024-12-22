const longPress = (node: HTMLElement, callback: () => void) => {
	$effect(() => {
		const onLongPress = (e: MouseEvent) => {
			e.preventDefault();
			callback();
		};
		const onDrag = (e: DragEvent) => {
			e.preventDefault();
		};

		node.addEventListener('contextmenu', (e) => {
			onLongPress(e);
		});
		node.addEventListener('dragstart', onDrag);

		return () => {
			node.removeEventListener('contextmenu', onLongPress);
			node.removeEventListener('dragstart', onDrag);
		};
	});
};

export default longPress;
