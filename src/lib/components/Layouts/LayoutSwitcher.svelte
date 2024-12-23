<script lang="ts">
	import type { LayoutItemProp } from '$lib/types/LayoutItem';
	import { DisplayType } from '$lib/stores/preferences/Display.svelte';
	import ListLayout from '$lib/components/Layouts/ListLayout.svelte';
	import GridLayout from '$lib/components/Layouts/GridLayout.svelte';

	interface ListLayoutProps {
		items: LayoutItemProp[];
		secondaryItems?: LayoutItemProp[][];
		currentType: DisplayType;
	}

	let { items, secondaryItems, currentType }: ListLayoutProps = $props();

</script>

{#if currentType === DisplayType.List}
	<ListLayout
		items={items}
		secondaryItems={secondaryItems}
	/>
{:else if currentType === DisplayType.Grid}
	<GridLayout items={items} />
{:else}
	Error: INVALID LAYOUT
{/if}