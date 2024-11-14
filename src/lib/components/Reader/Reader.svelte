<script lang="ts">
	import readerPreferencesStore from '$lib/stores/readerPreferencesStore.svelte';
	import { onMount } from 'svelte';

	interface Props {
		content: string;
	}

	let margins = $derived(readerPreferencesStore.value.pageMargins);

	let contentDiv: HTMLDivElement|undefined = $state();
	let innerWidth: number = $state(window.innerWidth);


	const calculatePageWidth = () => {
		return innerWidth - 2 * margins;
	}

	let pageWidth = $derived.by(calculatePageWidth);
	let pageHeight = $state(0);

	let pageCount = $state(1);
	let currentPage = $state(0);

	let progress = $derived(currentPage / pageCount);

	const onResize = async () => {
		if(!contentDiv) {
			return;
		}

		await new Promise<void>(resolve => { setTimeout(resolve, 10); });
		const pw = calculatePageWidth();

		pageHeight = contentDiv!.clientHeight;
		const oldProgress = progress;
		pageCount = Math.floor(contentDiv!.scrollWidth / (pw + margins));
		currentPage = Math.floor(oldProgress * pageCount);
		updateCurrentPage(currentPage, pw);
	}

	const updateCurrentPage = (page?: number, width?: number) => {
		const p = page ?? currentPage;
		const w = width ?? pageWidth;

		contentDiv!.scrollLeft = p * (w + margins);
		pageCount = Math.floor(contentDiv!.scrollWidth / (w + margins));
	}

	onMount(() => {
		onResize();
		setTimeout(() => {
			onResize();
		}, 300)
	})

	let props: Props = $props();

	const handleKeyDown = (event: KeyboardEvent) => {
		if(event.key === 'ArrowLeft') {
			changePage(-1);
		} else if (event.key === 'ArrowRight') {
			changePage(1);
		}
	}

	const changePage = (direction: number) => {

		if(direction < 0) {
			currentPage = Math.max(0, currentPage - 1);
			updateCurrentPage();
		} else {
			currentPage = Math.min(pageCount, currentPage + 1);
			updateCurrentPage();
		}
	}
</script>

<svelte:window
	bind:innerWidth={innerWidth}
    onresize={onResize}
    onkeydown={handleKeyDown}
/>

<div class="reader-container"
	 style="--margins: {margins}px;
	 		--pageWidth: {pageWidth}px;
			--pageHeight: {pageHeight}px;
			--fontSize: {readerPreferencesStore.value.fontSize}px;"
>
	<div
		id="content"
		bind:this={contentDiv}
		onresize={onResize}>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html props.content}
	</div>
	<div class="bottom-bar">
		{currentPage + 1} / {pageCount + 1}
	</div>
</div>

<style>
	:root {
		--bottom-bar-height: 2rem;
	}

	.bottom-bar {
		position: absolute;
		width: 100%;
		height: var(--bottom-bar-height);
		left: 0;
		bottom: 0;
	}

	.reader-container {
		position: relative;
		width: 100%;
		height: 100svh;
		max-height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		padding: var(--margins);
	}

	#content {
		height: calc(100% - var(--bottom-bar-height));
		overflow-x: auto;
		overflow-y: hidden;
		column-fill: auto;
		width: 100%;
		column-width: var(--pageWidth);
		column-gap: var(--margins);
		scrollbar-width: none;
		-ms-overflow-style: none;
		user-select: none;
	}

	#content :global(*) {
		line-height: 1.2em;
		max-width: var(--pageWidth);
		font-size: var(--fontSize);
	}

	#content :global(img) {
		object-fit: contain;
		display: inline-block;
		width: var(--pageWidth);
		min-width: var(--pageWidth);
		max-width: var(--pageWidth);
		height: var(--pageHeight);
		min-height: var(--pageHeight);
	}

	#content :global(p) {
		display: block;
		text-indent: 1rem;

		:global(&.noindent) {
			text-indent: 0;
		}
		:global(&.centerp) {
			text-align: center;
		}
		:global(&.diamond) {
			text-align: center;
			margin-top: 1em;
			margin-bottom: 1em;
		}
		:global(&.section-marking) {
			margin-top: 1em;
			margin-bottom: 1em;
		}
	}

	#content :global(hr) {
		margin-top: 0.2em;
		margin-bottom: 0.2em;
		color: black;
		background-color: black;
		width: 100%;
	}


</style>