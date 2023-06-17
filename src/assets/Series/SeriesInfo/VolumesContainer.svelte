<script lang="ts">
	import { handleSwipe } from "../../Helpers/SwipeHandler";
	import type { SeriesAggregate } from "../../../lib/types/Series";
	import { volumesPage } from "../../../lib/stores/seriesStore.js";
	import VolumeInfo from "./VolumeInfo.svelte";


	export let data: SeriesAggregate;

	export let nextPage = () => {};
	export let prevPage = () => {};
	export let rowCount = 0;
	export let itemsPerPage = 0;
</script>

<div
	class="volume-container"
	use:handleSwipe on:swipeLeft={prevPage} on:swipeRight={nextPage}
>
	{#each { length: rowCount } as _, i}
		<div class="volume-row">
			{#if data.volumes[$volumesPage * itemsPerPage + i]}
				<VolumeInfo
					volume={data.volumes[$volumesPage * itemsPerPage + i].volume}
					parts={data.volumes[$volumesPage * itemsPerPage + i].parts}
				/>
			{/if}
		</div>
	{/each}
</div>

<style>
	.volume-container {
		height: 100%;
	}
</style>