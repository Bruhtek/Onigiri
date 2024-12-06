<script lang="ts">
	import type { LayoutItemProp } from '$lib/types/LayoutItem';
	import preferencesStore from '$lib/stores/preferencesStore.svelte';
	import isVertical from '$lib/stores/orientationStore.svelte';
	import { changeReleasesPage, fetchMoreReleases, releasesPageProperties } from '$lib/api/releases.svelte';
	import gestureNavigation, { type Direction } from '$lib/helpers/useGestureNavigation.svelte';
	import GridItem from '$lib/components/Layouts/GridItem.svelte';
	import { untrack } from 'svelte';

	interface GridLayoutProps {
		items: LayoutItemProp[];
	}

	let { items }: GridLayoutProps = $props();

	const columnAspectRatio = 2 / 3;
	const gap = $derived(preferencesStore.value.gridObjectGap);

	let columnCount = $derived(isVertical.value ? preferencesStore.value.columnCountVertical : preferencesStore.value.columnCountHorizontal);

	let availableWidth = $state(0);
	let availableHeight = $state(0);

	$inspect(columnCount, isVertical.value);

	let { rowCount, itemHeight } = $derived.by(() => {
		const columnWidth = ((availableWidth - gap) / (columnCount)) - gap;
		const rowHeight = columnWidth / columnAspectRatio;
		return {
			rowCount: Math.floor((availableHeight - gap) / (rowHeight + gap)),
			itemHeight: rowHeight,
		};
	});

	let layoutVariables: string = $derived.by(() => {
		let variables = {
			'--gap': `${gap}px`,
			'--column-count': columnCount,
			'--row-count': rowCount,
			'--column-aspect-ratio': columnAspectRatio,
			'--item-height': `${itemHeight}px`,
		};
		return Object.entries(variables).map(([key, value]) => `${key}: ${value}`).join(';');
	});

	let itemsPerPage = $derived.by(() => columnCount * rowCount);
	let currentPage = $derived(releasesPageProperties.value.page);
	let itemsOnPage = $derived.by(() => items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage));

	$effect(() => {
		const ipp = itemsPerPage;
		const p = currentPage;
		const ic = items.length;

		untrack(() => {
			releasesPageProperties.patch({
				partsPerPage: ipp,
				page: p,
				itemsPerPage: ipp,
				itemsCount: ic,
			});
		});


		// if we are two pages away from the last page
		if (currentPage * itemsPerPage > items.length - itemsPerPage * 2) {
			untrack(() => {
				if (releasesPageProperties.value.lastPage || releasesPageProperties.value.loading) {
					return;
				}

				fetchMoreReleases();
			});
		}
	});

	const gestureCallback = (direction: Direction) => {
		if (direction == 'right') {
			changeReleasesPage(-1);
		} else if (direction == 'left') {
			changeReleasesPage(1);
		}
	};

</script>

<div
	class="layout"
	style={layoutVariables}
	bind:clientHeight={availableHeight}
	bind:clientWidth={availableWidth}
	use:gestureNavigation={gestureCallback}
>
	<div class="grid">
		{#each itemsOnPage as item}
			<GridItem item={item} />
		{/each}
	</div>
</div>

<style>
	.layout {
		width: 100%;
		height: 100%;
		padding: var(--gap);
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
</style>