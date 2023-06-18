<script lang="ts">
	import SerieItem from "./SerieItem.svelte";
	import { handleSwipe } from "../../Helpers/SwipeHandler";
	import { getMoreSeries, series, seriesPage } from "../../../lib/stores/seriesStore";
	import { onMount } from "svelte";

	export let itemsPerPage = 0;
	export let rowCount = 0;
	export let columnCount = 0;
	export let prevPage = () => {};
	export let nextPage = () => {};

	onMount(() => {
		if ($series.length === 0) {
			getMoreSeries(10000);
		}
	});
</script>


<div
	class="releases-container"
	use:handleSwipe on:swipeLeft={prevPage} on:swipeRight={nextPage}
>
	{#each { length: rowCount } as _, i}
		<div class="serie-row">
			{#each { length: columnCount } as _, j}
				{#if $series[$seriesPage * itemsPerPage + i * columnCount + j]}
					<SerieItem
						serie={$series[$seriesPage * itemsPerPage + i * columnCount + j]}
					/>
				{/if}
			{/each}
		</div>
	{/each}
</div>


<style>
	.releases-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
	}

	.serie-row {
		display: flex;
		flex-direction: row;
		height: var(--item-height);
		gap: var(--gap);
		margin-bottom: var(--gap);
	}

</style>