<script lang="ts">
	import GridDisplay from "../../Helpers/GridDisplay.svelte";
	import { seriesPage } from "../../../lib/stores/seriesStore";
	import SeriesContainer from "../SeriesList/SeriesContainer.svelte";
	import SeriesSettings from "../SeriesList/SeriesSettings.svelte";

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
