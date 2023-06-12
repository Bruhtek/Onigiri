<script lang="ts">
	import { parseContent } from "../../lib/parseContent";
	import BottomNavbar from "./BottomNavbar.svelte";
	import ReaderControl from "./ReaderControl.svelte";
	import { readerSettings } from "../../lib/stores/settingsStore";
	import { getPartById, setPartProgress } from "../../lib/stores/releasesStore";
	import { useParams } from "svelte-navigator";
	import { handleSwipe } from "../Helpers/SwipeHandler";

	const params = useParams();

	export let raw: string = "";



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
		const currentPart = getPartById($params.id);
		if(currentPart && currentPart) {
			contentDiv.scrollLeft = currentPart.progress * contentDiv.scrollWidth;
			snapScroll(true);
		}
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
	`;

	$: if(pageWidth && pageHeight) snapScroll()

	/// at which point on the X axis clicking goes to the next page
	const pageRegionSplitX = 0.5;
	// after 0.3 the click manages pages, before it manages controls
	const pageRegionSplitY = 0.3;

	export const scrollLeft = () => {
		contentDiv.scrollLeft -= pageWidth;
		snapScroll();
		updatePartProgress();
	};
	export const scrollRight = () => {
		contentDiv.scrollLeft += pageWidth;
		snapScroll();
		updatePartProgress();
	};

	const updatePartProgress = () => {
		if(contentDiv.scrollLeft === 0) {
			setPartProgress($params.id, 0);
			return;
		}
		const scrollLeft = contentDiv.scrollLeft + pageWidth;
		const scrollWidth = contentDiv.scrollWidth;
		const partProgress = scrollLeft / scrollWidth;

		setPartProgress($params.id, partProgress)
	}

	const snapScroll = (floor: boolean = false) => {
		const scrollLeft = contentDiv.scrollLeft;

		let nearestPage = Math.round(scrollLeft / pageWidth);
		if(floor) nearestPage = Math.floor(scrollLeft / pageWidth);
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

	$: pageCount = contentDiv ? Math.ceil(contentDiv.scrollWidth / pageWidth) : -1;
	$: currentPage = contentDiv ? Math.ceil(contentDiv.scrollLeft / pageWidth) + 1 : -1;

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
