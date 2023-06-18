<script lang="ts">
	import type { SeriesAggregate } from "../../../../lib/types/Series";
	import ListDisplay from "../../../Helpers/ListDisplay.svelte";
	import { listItemsPerPage, volumesPage } from "../../../../lib/stores/seriesStore";
	import VolumesContainer from "./VolumesContainer.svelte";
	import VolumesSettings from "./VolumesSettings.svelte";

	export let data: SeriesAggregate;

	$: pageCount = Math.ceil(data?.volumes?.length / $listItemsPerPage);

	const nextPage = () => {
		volumesPage.update((p) => Math.min(p + 1, pageCount - 1));
	};
	const prevPage = () => {
		volumesPage.update((p) => Math.max(p - 1, 0));
	};
</script>

<ListDisplay
	let:itemsPerPage={itemsPerPage}
	let:rowCount={rowCount}
>
	<VolumesContainer
		{itemsPerPage}
		{rowCount}
		{data}
		{nextPage}
		{prevPage}
	/>
</ListDisplay>
<VolumesSettings {pageCount} {nextPage} page={$volumesPage} {prevPage} />
