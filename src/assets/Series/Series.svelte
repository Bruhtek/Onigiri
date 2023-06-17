<script lang="ts">
	import GridDisplay from "../Helpers/GridDisplay.svelte";
	import { seriesPage } from "../../lib/stores/seriesStore";
	import SeriesContainer from "./SeriesContainer.svelte";
	import SeriesSettings from "./SeriesSettings.svelte";

	const nextPage = () => {
		seriesPage.update((p) => p + 1);
	};
	const prevPage = () => {
		seriesPage.update((p) => Math.max(p - 1, 0));
	};
</script>


<GridDisplay
	let:itemsPerPage={itemsPerPage}
	let:rowCount={rowCount}
	let:columnCount={columnCount}
	className="series-container"
>
	<SeriesContainer
		{itemsPerPage}
		{rowCount}
		{columnCount}
		{prevPage}
		{nextPage}
	/>
</GridDisplay>
<SeriesSettings {nextPage} page={$seriesPage} {prevPage} />


<style>
	:global(.series-container) {
		width: 100%;
		height: calc(95% + 20px);
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
	}
</style>