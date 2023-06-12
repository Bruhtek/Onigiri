<script lang="ts">
	import { viewSettings } from "../../lib/stores/settingsStore";
	import { getMoreReleases, releases, releasesPage } from "../../lib/stores/releasesStore";
	import ReleaseItem from "./ReleaseItem.svelte";
	import ReleasesSettings from "./ReleasesSettings.svelte";
	import { handleSwipe } from "../Helpers/SwipeHandler";

	$: minColumnWidth = $viewSettings.columnSize;

	const columnAspectRatio = 2 / 3;
	$: gap = $viewSettings.columnGap;

	let releasesContainer: HTMLDivElement = null;

	let availableWidth: number = 0;
	let availableHeight: number = 0;

	let itemsPerPage: number = 0;
	let rowCount = 0;
	let columnCount = 0;
	let itemHeight: number = 0;

	$: if (releasesContainer && $releases.length) {
		availableWidth = releasesContainer.clientWidth;
		availableHeight = releasesContainer.clientHeight;

		columnCount = Math.floor(availableWidth / (minColumnWidth + gap));

		const columnWidth = (availableWidth - (columnCount - 1) * gap) / columnCount;
		itemHeight = columnWidth / columnAspectRatio;
		rowCount = Math.floor(availableHeight / (itemHeight + gap));

		itemsPerPage = columnCount * rowCount;
		console.log(availableWidth, availableHeight, columnWidth, itemHeight, rowCount, itemsPerPage);
	}


	$: {
		// plus 2 -> one for the current page, one for the next page
		if ($releasesPage * (itemsPerPage + 2) >= $releases.length) {
			getMoreReleases($releasesPage * (itemsPerPage + 2) - $releases.length);
		}
	}

	const nextPage = () => {
		releasesPage.update((p) => p + 1);
	};
	const prevPage = () => {
		releasesPage.update((p) => Math.max(p - 1, 0));
	};

	$: cssVars = [
		{ name: "--item-height", value: `${itemHeight}px` },
		{ name: "--item-width", value: `${itemHeight * columnAspectRatio}px` },
		{ name: "--gap", value: `${gap}px` },
	].map(({ name, value }) => `${name}: ${value}`).join(";");
</script>


<div
	bind:this={releasesContainer}
	class="releases-container"
	style={cssVars}
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

	.release-row {
		display: flex;
		flex-direction: row;
		height: var(--item-height);
		gap: var(--gap);
		margin-bottom: var(--gap);
	}

</style>