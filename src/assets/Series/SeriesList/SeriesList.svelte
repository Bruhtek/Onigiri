<script lang="ts">
	import GridDisplay from "../../Helpers/GridDisplay.svelte";
	import { gridItemsPerPage, series, seriesPage } from "../../../lib/stores/seriesStore";
	import SeriesContainer from "../SeriesList/SeriesContainer.svelte";
	import SeriesSettings from "../SeriesList/SeriesSettings.svelte";

	$: pageCount = Math.ceil($series.length/$gridItemsPerPage)

	const nextPage = () => {
		seriesPage.update((p) => Math.min(p + 1, pageCount - 1));
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
<SeriesSettings pageCount={pageCount} {nextPage} page={$seriesPage} {prevPage} />
