<script lang="ts">
	import { parseContent } from "../../lib/parseContent";
	import PageCounter from "./PageCounter.svelte";
	import ReaderControl from "./ReaderControl.svelte";
	import { readerSettings } from "../../lib/stores/settingsStore";

	export let raw: string = "";



	$: content = parseContent(raw);

	let contentDiv: HTMLDivElement;
	let showControls = false;

	$: if (contentDiv) {
		contentDiv.innerHTML = content;
	}

	let documentWidth = document.body.clientWidth;
	$: pageWidth = documentWidth - 2 * $readerSettings.marginHorizontal;
	$: pageHeight = contentDiv ? contentDiv.clientHeight : 0;
	$: cssVars = `
	--page-width: ${pageWidth}px;
	--page-height: ${pageHeight}px;
	--margin-horizontal: ${$readerSettings.marginHorizontal}px;
	--margin-vertical: ${$readerSettings.marginVertical}px;
	--text-align: ${$readerSettings.justify ? "justify" : "left"};
	--font-size: ${$readerSettings.fontSize}px;
	`;



	/// at which point on the X axis clicking goes to the next page
	const pageRegionSplitX = 0.5;
	// after 0.3 the click manages pages, before it manages controls
	const pageRegionSplitY = 0.3;

	export const scrollLeft = () => {
		contentDiv.scrollLeft -= pageWidth;
		snapScroll();
	};
	export const scrollRight = () => {
		contentDiv.scrollLeft += pageWidth;
		snapScroll();
	};

	const snapScroll = () => {
		const scrollLeft = contentDiv.scrollLeft;

		const nearestPage = Math.round(scrollLeft / pageWidth);
		const nearestPageLeft = nearestPage * pageWidth;

		contentDiv.scrollTo({
			left: nearestPageLeft,
			behavior: "instant",
		});
	}

	const onpageclick = el => {
		el.addEventListener("click", (event) => {
			const actualY = event.clientY - el.offsetTop;
			const actualX = event.clientX - el.offsetLeft;

			if (showControls) {
				showControls = false;
				return;
			} else if (actualY / pageHeight < pageRegionSplitY) {
				showControls = true;
				return;
			}

			if (actualX / pageWidth < pageRegionSplitX) {
				scrollLeft();
			} else {
				scrollRight();
			}
		});
	};
	const scroll = el => {
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

		el.addEventListener("touchstart", (e) => {
			scrollStart = e.touches[0].clientX;
		});
		el.addEventListener("touchmove", (e) => {
			scrollEnd = e.touches[0].clientX;
			scrollDirection = scrollEnd - scrollStart;
			e.preventDefault();
		});
		el.addEventListener("touchend", (e) => {
			if (Math.abs(scrollDirection) < minScroll) {
				return;
			}
			if (scrollDirection < 0) {
				scrollRight();
			} else {
				scrollLeft();
			}
			e.preventDefault();
			scrollStart = 0;
			scrollEnd = 0;
			scrollDirection = 0;
		});
	}


	$: pageCount = contentDiv ? Math.ceil(contentDiv.scrollWidth / pageWidth) : -1;
	$: currentPage = contentDiv ? Math.ceil(contentDiv.scrollLeft / pageWidth) + 1 : -1;

</script>

<div class="container" style="{cssVars}" use:onpageclick use:scroll>
	{#if showControls}
		<ReaderControl />
	{/if}
	<div bind:this={contentDiv} id="content"></div>
	<PageCounter {currentPage} totalPages={pageCount} />
</div>


<style>
	:global(#content *) {
		font-family: "Times New Roman", Times, serif;
	}

	:global(#content img) {
		object-fit: contain;
		width: var(--page-width);
		height: var(--page-height);
		max-height: var(--page-height);
	}

	:global(#content p) {
		text-indent: 1em;
		padding-bottom: 0.5em;
		font-size: var(--font-size);
		text-align: var(--text-align);
	}


	.container {
		height: 100%;
		width: calc(var(--page-width) + (2 * var(--margin-horizontal)));
		padding: var(--margin-vertical) var(--margin-horizontal);
		border: 1px solid #ccc;
		position: relative;
	}

	#content {
		box-sizing: content-box;
		padding: 0;
		margin: 0;
		height: 100%;
		overflow: auto;
		column-fill: auto;
		column-gap: 0;
		width: var(--page-width);
		column-width: var(--page-width);

		overflow-y: hidden;

		scrollbar-width: none;
		-ms-overflow-style: none;
		user-select: none;
	}

	#content::-webkit-scrollbar {
		display: none;
	}
</style>
