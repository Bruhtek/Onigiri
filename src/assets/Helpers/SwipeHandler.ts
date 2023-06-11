export const handleSwipe = (el: HTMLElement) => {
	let scrollStart = 0;
	let scrollEnd = 0;
	let scrollDirection = 0;
	const minScroll = 20;

	el.addEventListener("scroll", (e) => {
		e.preventDefault();
	});
	el.addEventListener("scrollend", (e) => {
		e.preventDefault();
	});

	const handleTouchStart = (e: TouchEvent) => {
		scrollStart = e.touches[0].clientX;
	}
	const handleTouchMove = (e: TouchEvent) => {
		scrollEnd = e.touches[0].clientX;
		scrollDirection = scrollEnd - scrollStart;
		e.preventDefault();
	}
	const handleTouchEnd = (e: TouchEvent) => {
		if (Math.abs(scrollDirection) < minScroll) {
			return;
		}
		if (scrollDirection < 0) {
			el.dispatchEvent(new CustomEvent("swipeRight"));
		} else {
			el.dispatchEvent(new CustomEvent("swipeLeft"));
		}
		e.preventDefault();
		scrollStart = 0;
		scrollEnd = 0;
		scrollDirection = 0;
	}

	el.addEventListener("touchstart", handleTouchStart);
	el.addEventListener("touchmove", handleTouchMove);
	el.addEventListener("touchend", handleTouchEnd);

	return () => {
		el.removeEventListener("scroll", (e) => {
			e.preventDefault();
		});
		el.removeEventListener("scrollend", (e) => {
			e.preventDefault();
		});
		el.removeEventListener("touchstart", handleTouchStart);
		el.removeEventListener("touchmove", handleTouchMove);
		el.removeEventListener("touchend", handleTouchEnd);
	}
}
