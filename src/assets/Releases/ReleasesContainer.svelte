<script lang="ts">
	import { getMoreReleases, releases, releasesPage } from "../../lib/stores/releasesStore";
	import ReleaseItem from "./ReleaseItem.svelte";
	import { handleSwipe } from "../Helpers/SwipeHandler";

	export let itemsPerPage = 0;
	export let rowCount = 0;
	export let columnCount = 0;
	export let prevPage = () => {};
	export let nextPage = () => {};

	$: {
		// plus 2 -> one for the current page, one for the next page
		if (($releasesPage + 2) * itemsPerPage >= $releases.length) {
			let remaining = $releases.length - ($releasesPage + 2) * itemsPerPage;
			getMoreReleases(Math.max(remaining, itemsPerPage));
		}
	}
</script>


<div
	class="releases-container"
	use:handleSwipe on:swipeLeft={prevPage} on:swipeRight={nextPage}
>
	{#each Array.from({ length: rowCount }) as _, i}
		<div class="release-row">
			{#each Array.from({ length: columnCount }) as _, j}
				{#if $releases[$releasesPage * itemsPerPage + i * columnCount + j]}
					<ReleaseItem
						release={$releases[$releasesPage * itemsPerPage + i * columnCount + j]}
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

	.release-row {
		display: flex;
		flex-direction: row;
		height: var(--item-height);
		gap: var(--gap);
		margin-bottom: var(--gap);
	}

</style>