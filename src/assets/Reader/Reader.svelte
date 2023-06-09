<script lang="ts">
	import { parseContent } from "../../lib/parseContent";
	import PageCounter from "./PageCounter.svelte";
	import ReaderControl from "../Releases/ReaderControl.svelte";

	export let raw: string = "";

	$: console.log(raw);

	$: content = parseContent(raw);

	let contentDiv: HTMLDivElement;
	let showControls = false;

	$: if (contentDiv) {
		contentDiv.innerHTML = content;
	}

	let documentWidth = document.body.clientWidth;
	$: pageWidth = documentWidth - 60;
	$: pageHeight = contentDiv ? contentDiv.clientHeight : 0;
	$: cssVars = `--page-width: ${pageWidth}px; --page-height: ${pageHeight}px;`;


	function nextPage() {
		const content = document.getElementById("content");
		content.scrollLeft += pageWidth;
	}

	/// at which point on the X axis clicking goes to the next page
	const pageRegionSplitX = 0.5;
	// after 0.3 the click manages pages, before it manages controls
	const pageRegionSplitY = 0.3;

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

	export const scrollLeft = () => {
		contentDiv.scrollLeft -= pageWidth;
	};
	export const scrollRight = () => {
		contentDiv.scrollLeft += pageWidth;
	};

	$: pageCount = contentDiv ? Math.ceil(contentDiv.scrollWidth / pageWidth) : -1;
	$: currentPage = contentDiv ? Math.ceil(contentDiv.scrollLeft / pageWidth) + 1 : -1;

</script>

<div class="container" style="{cssVars}" use:onpageclick>
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
	}


	.container {
		height: 100%;
		width: calc(var(--page-width) + 60px);
		padding: 30px;
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
