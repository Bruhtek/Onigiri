<script lang="ts">
	import { releasesPage } from "../../lib/stores/releasesStore";
	import ReleasesSettings from "./ReleasesSettings.svelte";
	import GridDisplay from "../Helpers/GridDisplay.svelte";
	import ReleasesContainer from "./ReleasesContainer.svelte";

	const nextPage = () => {
		releasesPage.update((p) => p + 1);
	};
	const prevPage = () => {
		releasesPage.update((p) => Math.max(p - 1, 0));
	};
</script>


<GridDisplay
	let:itemsPerPage={itemsPerPage}
	let:rowCount={rowCount}
	let:columnCount={columnCount}
	class="releases-container"
>
	<ReleasesContainer {itemsPerPage} {rowCount} {columnCount} {prevPage} {nextPage} />
</GridDisplay>
<ReleasesSettings {nextPage} page={$releasesPage} {prevPage} />


<style>
	.releases-container {
		width: 100%;
		height: calc(95% + 20px);
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
	}
</style>