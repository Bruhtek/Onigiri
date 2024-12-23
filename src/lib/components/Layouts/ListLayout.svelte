<script lang="ts">
	import type { LayoutItemProp } from '$lib/types/LayoutItem';
	import PrefDisplay from '$lib/stores/preferences/Display.svelte';
	import Releases from '$lib/api/Releases.svelte';
	import gestureNavigation, { type Direction } from '$lib/helpers/useGestureNavigation.svelte';
	import { untrack } from 'svelte';
	import DisplayPage from '$lib/stores/DisplayPage.svelte.js';
	import ListItem from '$lib/components/Layouts/ListItem.svelte';

	interface ListLayoutProps {
		items: LayoutItemProp[];
		secondaryItems?: LayoutItemProp[][];
	}

	let { items, secondaryItems = [] }: ListLayoutProps = $props();

	const gap = $derived(PrefDisplay.v.gridObjectGap);

	let availableHeight = $state(0);
	let itemsPerPage = $derived(Math.floor((availableHeight / PrefDisplay.v.listMinObjectHeight)));
	let itemHeight = $derived((availableHeight / itemsPerPage) - gap);

	let layoutVariables: string = $derived.by(() => {
		let variables = {
			'--gap': `${gap}px`,
			'--row-count': itemsPerPage,
			'--item-height': `${itemHeight}px`,
		};
		return Object.entries(variables).map(([key, value]) => `${key}: ${value}`).join(';');
	});

	let currentPage = $derived(DisplayPage.currentPage);
	let itemsOnPage = $derived.by(() => items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage));
	let secondaryItemsOnPage = $derived.by(() => secondaryItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage));

	$effect(() => {
		const ipp = itemsPerPage;
		const p = currentPage;
		const ic = items.length;

		untrack(() => {
			DisplayPage.patch({
				itemsPerPage: ipp,
				itemsCount: ic,
			});
			DisplayPage.setPage(p);
		});


		// if we are two pages away from the last page
		if (currentPage * itemsPerPage > items.length - itemsPerPage * 2) {
			untrack(() => {
				if (DisplayPage.v.currentDisplay !== 'RELEASES' || DisplayPage.v.lastPage) {
					return;
				}

				Releases.fetchMoreReleases();
			});
		}
	});

	$effect(() => {
		if (items.length > 0) {
			untrack(() => {
				DisplayPage.changePage(0);
			});
		}
	});


	const gestureCallback = (direction: Direction) => {
		if (direction == 'right') {
			DisplayPage.changePage(-1);
		} else if (direction == 'left') {
			DisplayPage.changePage(1);
		}
	};

</script>

<div
	class="layout"
	style={layoutVariables}
	bind:clientHeight={availableHeight}
	use:gestureNavigation={gestureCallback}
>
	<div class="list">
		{#each itemsOnPage as item, i}
			<ListItem
				item={item}
				secondaryItems={secondaryItemsOnPage[i]}
			/>
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

	.list {
		position: relative;
		top: 50%;
		transform: translateY(-50%);
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: repeat(var(--row-count), var(--item-height));
		grid-gap: var(--gap);
	}
</style>