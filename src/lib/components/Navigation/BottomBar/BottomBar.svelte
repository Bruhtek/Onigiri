<script lang="ts">
	import ArrowRight from '~icons/ph/arrow-right';
	import ArrowLeft from '~icons/ph/arrow-left';
	import Gear from '~icons/ph/gear';
	import type { Snippet } from 'svelte';
	import DisplayPage from '$lib/stores/DisplayPage.svelte.js';

	let { settingsPanel, rightPanel, leftPanel, showTotalPages }: {
		settingsPanel: Snippet,
		rightPanel?: Snippet,
		leftPanel?: Snippet
		showTotalPages?: boolean
	} = $props();

	let settingsOpen = $state<boolean>(false);
</script>

<div class="bottom-bar">
	{#if settingsOpen}
		{@render settingsPanel()}
	{/if}
	<div class="left">
		{#if leftPanel}
			{@render leftPanel()}
		{/if}
	</div>
	<div class="page-data">
		<button class="button-left" onclick={() => DisplayPage.changePage(-1)}>
			<ArrowLeft width="32" height="32" />
		</button>
		<span>
			{DisplayPage.currentPage + 1}
			{#if showTotalPages}
				/
				{Math.ceil(DisplayPage.v.itemsCount / DisplayPage.v.itemsPerPage)}
			{/if}
		</span>
		<button class="button-right" onclick={() => DisplayPage.changePage(1)}>
			<ArrowRight width="32" height="32" />
		</button>
	</div>
	<div class="right">
		{#if rightPanel}
			{@render rightPanel()}
		{/if}
		<button onclick={() => settingsOpen = !settingsOpen}>
			<Gear width="32px" height="32px" />
		</button>
	</div>
</div>

<style>
	.bottom-bar {
		display: flex;
		height: 3rem;
		place-content: center;
		position: relative;
	}

	.bottom-bar .right, .left {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}

	.right {
		right: 1rem;
		display: flex;
		gap: 0.5rem;
	}

	.left {
		left: 1rem;
	}

	.page-data {
		display: flex;
		align-items: center;
		align-content: center;
		gap: 1rem;
	}

	span {
		font-size: 1.3rem;
		padding-bottom: 0.2rem;
	}
</style>