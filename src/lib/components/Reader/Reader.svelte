<script lang="ts">
	import PrefReader from '$lib/stores/preferences/Reader.svelte';
	import { onMount, untrack } from 'svelte';
	import gestureNavigation, { type Direction } from '$lib/helpers/useGestureNavigation.svelte';
	import BottomBar from '$lib/components/Reader/BottomBar.svelte';
	import touchPosition from '$lib/helpers/useTouchPosition.svelte';
	import ReaderSettings from '$lib/components/Reader/ReaderSettings/ReaderSettings.svelte';
	import { waitMS } from '$lib/helpers/utils';
	import ArrowRight from '~icons/ph/arrow-right';
	import Parts from '$lib/api/Parts.svelte';
	import type { PartTocResult } from '$lib/api/Parts.svelte';
	import type { Result } from '$lib/types/HelperTypes';

	interface Props {
		content: string;
		partTocResult: Result<PartTocResult>;
		toggleZones: (state: boolean) => unknown;
		loading: boolean;
		minimal?: boolean;
		id: string;
	}

	let props: Props = $props();

	let ready = $state<boolean>(false);

	let fontFamilyCSS = $derived(PrefReader.mapFontFamily().css);
	let showSettings = $state<boolean>(false);

	let contentDiv: HTMLDivElement|undefined = $state();
	let innerWidth: number = $state(window.innerWidth);


	const calculatePageWidth = () => {
		return innerWidth - 2 * PrefReader.v.pageMargins;
	}

	let pageWidth = $derived.by(calculatePageWidth);
	let pageHeight = $state(0);

	let pageCount = $state(1);
	let currentPage = $state(0);

	let progress = $derived(currentPage / pageCount);

	const onResize = async () => {
		// hacky, but it works!
		await waitMS(0);

		const pw = calculatePageWidth();

		if(!contentDiv) {
			return;
		}

		pageHeight = contentDiv!.clientHeight;
		const oldProgress = progress;
		pageCount = Math.floor(contentDiv!.scrollWidth / (pw + PrefReader.v.pageMargins));
		currentPage = Math.floor(oldProgress * pageCount);
		updateCurrentPage(currentPage, pw);
	}

	let shouldGoToProgress = $state<boolean>(false);

	const updateCurrentPage = (page?: number, width?: number) => {
		let p = page ?? currentPage ?? 0;
		if(isNaN(p)) {
			p = 0;
		}
		const w = width ?? pageWidth;

		currentPage = p;

		contentDiv!.scrollLeft = p * (w + PrefReader.v.pageMargins);
		pageCount = Math.floor(contentDiv!.scrollWidth / (w + PrefReader.v.pageMargins));

		if(ready && !props.minimal) {
			Parts.updatePartProgress(props.id, currentPage / pageCount);
		}
	}

	onMount(async () => {
		await onResize();
		await waitMS(300);
		await onResize();
		if(shouldGoToProgress) {
			if(props.partTocResult.error !== false) {
				return;
			}
			updateCurrentPage(Math.round(props.partTocResult.data.currentPart.progress * pageCount));
			shouldGoToProgress = false;
		} else {
			shouldGoToProgress = true;
		}
		ready = true;
	})

	$effect(() => {
		if(props.partTocResult.error !== false) {
			return;
		}

		if(untrack(() => shouldGoToProgress)) {
			console.log("Going to progress from effect", Math.floor(props.partTocResult.data.currentPart.progress * pageCount));
			updateCurrentPage(Math.floor(props.partTocResult.data.currentPart.progress * pageCount));
			shouldGoToProgress = false;
		} else {
			shouldGoToProgress = true;
		}
	})
	$effect(() => {
		if(PrefReader.v.pageMargins) {
			onResize();
		}
	})

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

	const gestureCallback = (direction: Direction) => {
		if (direction == 'right') {
			changePage(-1);
		} else if (direction == 'left') {
			changePage(1);
		}
	};

	let tapActions = $derived(PrefReader.mapTapZones());

	let timer = $state<number>(0);

	const touchPositionCallback = (x: number, y: number) => {
		console.log('On touch position');

		clearTimeout(timer);
		timer = setTimeout(() => {
			const action = tapActions[Math.floor(y * 3)][Math.floor(x * 3)][0] as "P" | "S" | "N" | "X";

			switch (action) {
				case 'N':
					changePage(1);
					break;
				case "P":
					changePage(-1);
					break;
				case "S":
					showSettings = true;
					break;
				case 'X':
					break;
			}
			// hacky workaround, Svelte with Node.js doesn't like treating
			// setTimeout as numbers, and in this file we cant expand the type
		}, 30) as unknown as number;
	}
</script>

<svelte:window
	bind:innerWidth={innerWidth}
    onresize={onResize}
    onkeydown={handleKeyDown}
	use:gestureNavigation={gestureCallback}
/>

{#if showSettings && !props.minimal}
	<ReaderSettings
		onHide={() => showSettings = false}
		toggleZones={props.toggleZones}
		partTocResult={props.partTocResult}
	/>
{/if}

<div class="reader-container"
	 class:hide={!ready && !props.loading && !props.minimal}
	 style="--margins: {PrefReader.v.pageMargins}px;
	 		--pageWidth: {pageWidth}px;
			--pageHeight: {pageHeight}px;
			--fontSize: {PrefReader.v.fontSize}px;
			--font-family: {fontFamilyCSS};
			--text-align: {PrefReader.v.justifyText ? 'justify' : 'left'};
			--line-height: {PrefReader.v.lineSpacing}em;
			--paragraph-spacing: {PrefReader.v.paragraphSpacing}px;
"
	 use:touchPosition={touchPositionCallback}
>
	<div
		id="content"
		bind:this={contentDiv}
		onresize={onResize}>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html props.content}

		{#if props.partTocResult && props.partTocResult.error === false && props.partTocResult.data.nextPart}
			<a class="button next-part-button" href="/reader/{props.partTocResult.data.nextPart.id}">
				Next Part <ArrowRight width="32" height="32" />
			</a>
		{/if}
	</div>
	<BottomBar minimal={props.minimal} page={currentPage} totalPages={pageCount} />
</div>

<style>
	:root {
		--bottom-bar-height: 2rem;
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
		padding-bottom: var(--bottom-bar-height);
		min-height: 0;
	}
	.reader-container.hide {
		opacity: 0;
	}
	.next-part-button {
		width: max-content;
		margin: 2rem auto;
		padding: 0.5rem;
	}

	#content {
		height: 100%;
		overflow-x: hidden;
		overflow-y: hidden;
		column-fill: auto;
		/*width: var(--pageWidth);*/
		column-width: var(--pageWidth);
		column-gap: var(--margins);
		scrollbar-width: none;
		-ms-overflow-style: none;
		user-select: none;
		font-family: var(--font-family), fantasy;
		text-align: var(--text-align);
		margin-bottom: -0.5em;
	}

	#content :global(*) {
		line-height: var(--line-height);
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

	#content :global(h1) {
		font-size: 1.55em;
		margin-top: 2em;
		margin-bottom: 1em;
		text-indent: 20pt;
	}
	#content :global(h2) {
		font-size: 1.15em;
		margin-top: 1.5em;
		margin-bottom: .5em;
		text-indent: 20pt;
	}

	#content :global(p) {
		display: block;
		text-indent: 1rem;

		:global(+ p) {
			margin-top: var(--paragraph-spacing);
		}

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
		color: var(--text);
		background-color: var(--text);
		width: 100%;
	}


</style>