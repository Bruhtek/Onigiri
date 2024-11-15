export type Direction = 'up' | 'down' | 'left' | 'right';
type Coordinates = { x: number; y: number };

const gestureNavigation = (node: HTMLElement, callback: (direction: Direction) => void) => {
	let scrollStart = $state<Coordinates>({ x: 0, y: 0 });
	let scrollEnd = $state<Coordinates>({ x: 0, y: 0 });
	let scrollDirectionX = $state(0);
	let scrollDirectionY = $state(0);
	const minScroll = 30;

	const reset = () => {
		scrollStart = { x: 0, y: 0 };
		scrollEnd = { x: 0, y: 0 };
		scrollDirectionX = 0;
		scrollDirectionY = 0;
	};

	const handleScroll = (e: Event) => {
		e.preventDefault();
	};
	const handleTouchStart = (e: TouchEvent) => {
		scrollStart.x = e.touches[0].clientX;
		scrollStart.y = e.touches[0].clientY;
	};
	const handleTouchMove = (e: TouchEvent) => {
		scrollEnd.x = e.touches[0].clientX;
		scrollEnd.y = e.touches[0].clientY;
		scrollDirectionX = scrollStart.x - scrollEnd.x;
		scrollDirectionY = scrollStart.y - scrollEnd.y;
		e.preventDefault();
	};
	const handleTouchEnd = (e: TouchEvent) => {
		// only trigger if the scroll is bigger by minScroll
		if (Math.abs(scrollDirectionX) > Math.abs(scrollDirectionY) + minScroll) {
			if (scrollDirectionX > minScroll) {
				callback('left');
				e.preventDefault();
			} else if (scrollDirectionX < -minScroll) {
				callback('right');
				e.preventDefault();
			}
			// same thing here
		} else if (Math.abs(scrollDirectionY) > Math.abs(scrollDirectionX) + minScroll) {
			if (scrollDirectionY > minScroll) {
				callback('up');
				e.preventDefault();
			} else if (scrollDirectionY < -minScroll) {
				callback('down');
				e.preventDefault();
			}
		}
		reset();
	};

	node.addEventListener('scroll', handleScroll);
	node.addEventListener('scrollend', handleScroll);
	node.addEventListener('touchstart', handleTouchStart);
	node.addEventListener('touchmove', handleTouchMove);
	node.addEventListener('touchend', handleTouchEnd);

	return {
		destroy: () => {
			node.removeEventListener('scroll', handleScroll);
			node.removeEventListener('scrollend', handleScroll);
			node.removeEventListener('touchstart', handleTouchStart);
			node.removeEventListener('touchmove', handleTouchMove);
			node.removeEventListener('touchend', handleTouchEnd);
		},
	};
};

export default gestureNavigation;
