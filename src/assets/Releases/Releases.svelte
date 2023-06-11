<script lang="ts">
	import { viewSettings } from "../../lib/stores/settingsStore";
	import { getMoreReleases, releases } from "../../lib/stores/releasesStore";
	import ReleaseItem from "./ReleaseItem.svelte";
	import PageControl from "./PageControl.svelte";
	import { handleSwipe } from "../Helpers/SwipeHandler";

	$: columnCount = $viewSettings.columns;

	const columnAspectRatio = 2 / 3;
	const gap = 20;

	let releasesContainer: HTMLDivElement = null;

	let availableWidth: number = 0;
	let availableHeight: number = 0;

	let itemsPerPage: number = 0;
	let rowCount = 0;
	let itemHeight: number = 0;

	$: if (releasesContainer && $releases.length) {
		availableWidth = releasesContainer.clientWidth;
		availableHeight = releasesContainer.clientHeight;

		const columnWidth = (availableWidth - (columnCount - 1) * gap) / columnCount;
		itemHeight = columnWidth / columnAspectRatio;
		rowCount = Math.floor(availableHeight / (itemHeight + gap));

		itemsPerPage = columnCount * rowCount;
		console.log(availableWidth, availableHeight, columnWidth, itemHeight, rowCount, itemsPerPage);
	}

	let currentPage = 0;

	$: {
		// plus 2 -> one for the current page, one for the next page
		if (currentPage * (itemsPerPage + 2) >= $releases.length) {
			getMoreReleases();
		}
	}

	const nextPage = () => {
		currentPage++;
		console.log(currentPage);
	};
	const prevPage = () => {
		currentPage--;
		if(currentPage < 0) currentPage = 0;
		console.log(currentPage);
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
				{#if $releases[currentPage * itemsPerPage + i * columnCount + j]}
					<ReleaseItem
						release={$releases[currentPage * itemsPerPage + i * columnCount + j]}
					/>
				{/if}
			{/each}
		</div>
	{/each}
	<PageControl {nextPage} page={currentPage} {prevPage} />
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