<script lang="ts">
	import { parseContent } from "../../lib/parseContent";
	import BottomNavbar from "./BottomNavbar.svelte";
	import ReaderControl from "./ReaderControl.svelte";
	import { readerSettings } from "../../lib/stores/settingsStore";
	import { handleSwipe } from "../Helpers/SwipeHandler";
	import { setPartProgress } from "../../lib/setPartProgress";

	export let bookId: string;

	export let raw = "";
	export let progress: number = 0;

	const columnGap = 40;

	$: content = parseContent(raw);

	let contentDiv: HTMLDivElement;
	let showControls = false;

	let progressAlreadySet = false;

	$: if (contentDiv) {
		contentDiv.innerHTML = content;

		if(!progressAlreadySet) {
			// wait for the DOM to update, this seems like a hacky fix, but it's the only thing I can think of
			setTimeout(() => {
				goToPartProgress();
			}, 100)
		}
	}

	const goToPartProgress = () => {
		contentDiv.scrollLeft = progress * contentDiv.scrollWidth;
		snapScroll(true);
		progressAlreadySet = true;
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
	--column-gap: ${columnGap}px;
	`;

	$: if(pageWidth && pageHeight) snapScroll()

	/// at which point on the X axis clicking goes to the next page
	const pageRegionSplitX = 0.5;
	// after 0.3 the click manages pages, before it manages controls
	const pageRegionSplitY = 0.3;

	export const scrollLeft = () => {
		contentDiv.scrollLeft -= pageWidth + columnGap;
		snapScroll();
		updatePartProgress();
	};
	export const scrollRight = () => {
		contentDiv.scrollLeft += pageWidth + columnGap;
		snapScroll();
		updatePartProgress();
	};

	const updatePartProgress = () => {
		if(contentDiv.scrollLeft === 0) {
			setPartProgress(bookId, 0);
			return;
		}
		const scrollLeft = contentDiv.scrollLeft + pageWidth;
		const scrollWidth = contentDiv.scrollWidth;
		const partProgress = scrollLeft / scrollWidth;

		setPartProgress(bookId, partProgress)
	}

	$: bookId && progress && goToPartProgress();

	const snapScroll = (floor = false) => {
		const scrollLeft = contentDiv.scrollLeft;

		let nearestPage = Math.round(scrollLeft / (pageWidth + columnGap));
		if(floor) nearestPage = Math.floor(scrollLeft / (pageWidth + columnGap));
		contentDiv.scrollLeft = nearestPage * (pageWidth + columnGap);
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

	$: pageCount = contentDiv ? Math.ceil(contentDiv.scrollWidth / (pageWidth + columnGap)) : -1;
	$: currentPage = contentDiv ? Math.ceil(contentDiv.scrollLeft / (pageWidth + columnGap)) + 1 : -1;

</script>

<div
	class="container"
	style="{cssVars}"
	use:onpageclick
	use:handleSwipe
	on:swipeLeft={scrollLeft}
	on:swipeRight={scrollRight}
>
	{#if showControls}
		<ReaderControl />
	{/if}
	<div bind:this={contentDiv} id="content"></div>
	<BottomNavbar {currentPage} totalPages={pageCount} />
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
		display: inline-block;
	}

	:global(#content p) {
		text-indent: 1em;
		font-size: var(--font-size);
		text-align: var(--text-align);
	}
	:global(#content p + p) {
		padding-top: 0.5em;
	}

	:global(#content h1) {
		padding-bottom: 0.5em;
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
		height: calc(100% - 1.5rem);
		overflow: auto;
		column-fill: auto;
		width: var(--page-width);
		column-width: var(--page-width);
		column-gap: var(--column-gap);

		overflow-y: hidden;

		scrollbar-width: none;
		-ms-overflow-style: none;
		user-select: none;
	}

	#content::-webkit-scrollbar {
		display: none;
	}
</style>
