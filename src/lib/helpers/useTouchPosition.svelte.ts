import type { Action } from 'svelte/action';

const touchPosition: Action<HTMLDivElement, (x: number, y: number) => void> = (node, callback) => {
	$effect(() => {
		const handleClick = (event: MouseEvent) => {
			const nodeSize = node.getBoundingClientRect();
			const sizeX = nodeSize.width;
			const sizeY = nodeSize.height;
			const top = nodeSize.top;
			const left = nodeSize.left;
			
			const positionX = event.clientX - left;
			const positionY = event.clientY - top;

			const percentageX = Math.round((positionX * 100) / sizeX) / 100;
			const percentageY = Math.round((positionY * 100) / sizeY) / 100;

			callback(percentageX, percentageY);
		};

		node.addEventListener('click', handleClick);

		return () => {
			node.removeEventListener('click', handleClick);
		};
	});
};

export default touchPosition;
