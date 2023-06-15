<script lang="ts">
	import SerieItem from "./SerieItem.svelte";
	import { handleSwipe } from "../Helpers/SwipeHandler";
	import { getMoreSeries, series, seriesPage } from "../../lib/stores/seriesStore";

	export let itemsPerPage = 0;
	export let rowCount = 0;
	export let columnCount = 0;
	export let prevPage = () => {};
	export let nextPage = () => {};

	$: {
		// plus 2 -> one for the current page, one for the next page
		if (($seriesPage + 2) * itemsPerPage >= $series.length) {
			let remaining = $series.length - ($seriesPage + 2) * itemsPerPage;
			getMoreSeries(Math.max(remaining, itemsPerPage));
		}
	}
</script>


<div
	class="releases-container"
	use:handleSwipe on:swipeLeft={prevPage} on:swipeRight={nextPage}
>
	{#each Array.from({ length: rowCount }) as _, i}
		<div class="serie-row">
			{#each Array.from({ length: columnCount }) as _, j}
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