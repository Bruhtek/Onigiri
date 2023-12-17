<script lang="ts">
	import { getMoreReleases, releases, releasesPage } from "../../lib/stores/releasesStore";
	import ReleaseItem from "./ReleaseItem.svelte";
	import { handleSwipe } from "../Helpers/SwipeHandler";
	import { viewSettings } from "../../lib/stores/settingsStore";

	export let itemsPerPage = 0;
	export let rowCount = 0;
	export let columnCount = 0;
	export let prevPage = () => {};
	export let nextPage = () => {};

	$: actualReleases = $releases;

	$: if($viewSettings.hideMangas) {
		actualReleases = actualReleases.filter(release => !release.isManga);
	} else {
		actualReleases = $releases;
	}

	$: {
		// plus 2 -> one for the current page, one for the next page
		if (($releasesPage + 2) * itemsPerPage >= actualReleases.length) {
			let remaining = actualReleases.length - ($releasesPage + 2) * itemsPerPage;
			console.log("getting more releases", Math.max(remaining, itemsPerPage));
			getMoreReleases(Math.max(remaining, itemsPerPage));
		}
	}
</script>


<div
	class="releases-container"
	use:handleSwipe on:swipeLeft={prevPage} on:swipeRight={nextPage}
>
	{#each { length: rowCount } as _, i}
		<div class="release-row">
			{#each { length: columnCount } as _, j}
				{#if actualReleases[$releasesPage * itemsPerPage + i * columnCount + j]}
					<ReleaseItem
						release={actualReleases[$releasesPage * itemsPerPage + i * columnCount + j]}
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