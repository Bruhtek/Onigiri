<script lang="ts">
	import type { LayoutItemProp } from '$lib/types/LayoutItem';
	import preferencesStore from '$lib/stores/preferencesStore.svelte';
	import isVertical from '$lib/stores/orientationStore.svelte';

	interface GridLayoutProps {
		items: LayoutItemProp[];
	}

	let { items }: GridLayoutProps = $props();

	const columnAspectRatio = 2 / 3;
	const gap = 16;

	let columnCount = $derived(isVertical.value ? preferencesStore.value.columnCountVertical : preferencesStore.value.columnCountHorizontal);

	let availableWidth = $state(0);
	let availableHeight = $state(0);
	
	const resizeObserver = (el: HTMLDivElement) => {
		const resizeObserver = new ResizeObserver((entries) => {
			const { width, height } = entries[0].contentRect;
			availableWidth = width;
			availableHeight = height;
		});

		resizeObserver.observe(el);

		return {
			destroy: () => {
				resizeObserver.disconnect();
			}
		};
	};

	$inspect({ availableWidth, availableHeight });

	let { rowCount, itemHeight } = $derived.by(() => {
		const columnWidth = ((availableWidth + gap) / (columnCount)) - gap;
		const rowHeight = columnWidth / columnAspectRatio;
		return {
			rowCount: Math.floor((availableHeight + gap) / (rowHeight + gap)),
			itemHeight: rowHeight
		};
	});

	let layoutVariables: string = $derived.by(() => {
		let variables = {
			'--gap': `${gap}px`,
			'--column-count': columnCount,
			'--row-count': rowCount,
			'--column-aspect-ratio': columnAspectRatio,
			'--item-height': `${itemHeight}px`
		};
		return Object.entries(variables).map(([key, value]) => `${key}: ${value}`).join(';');
	});

	let itemsPerPage = $derived.by(() => columnCount * rowCount);
</script>

<div class="layout" use:resizeObserver style={layoutVariables}>
	<div class="grid">
		{#each items as _, i}
			{#if i < itemsPerPage}
				<div class="item">{i}</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.layout {
		width: calc(100% - var(--gap) * 2);
		height: calc(100% - var(--gap) * 2);
		margin: var(--gap);
		position: relative;
	}

	.grid {
		position: relative;
		top: 50%;
		transform: translateY(-50%);
		display: grid;
		grid-template-columns: repeat(var(--column-count), 1fr);
		grid-template-rows: repeat(var(--row-count), var(--item-height));
		grid-gap: var(--gap);
	}

	.item {
		background-color: black;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 100%;
		aspect-ratio: var(--column-aspect-ratio);
	}
</style>