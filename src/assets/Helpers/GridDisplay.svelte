<script lang="ts">
	import { viewSettings } from "../../lib/stores/settingsStore";

	$: minColumnWidth = $viewSettings.columnSize;

	const columnAspectRatio = 2 / 3;
	$: gap = $viewSettings.columnGap;

	let container: HTMLDivElement = null;

	let availableWidth: number = 0;
	let availableHeight: number = 0;

	let itemsPerPage: number = 0;
	let rowCount = 0;
	let columnCount = 0;
	let itemHeight: number = 0;

	$: if (container) {
		availableWidth = container.clientWidth;
		availableHeight = container.clientHeight;

		columnCount = Math.floor(availableWidth / (minColumnWidth + gap));

		const columnWidth = (availableWidth - (columnCount - 1) * gap) / columnCount;
		itemHeight = columnWidth / columnAspectRatio;
		rowCount = Math.floor(availableHeight / (itemHeight + gap));

		itemsPerPage = columnCount * rowCount;
	}


	$: cssVars = [
		{ name: "--item-height", value: `${itemHeight}px` },
		{ name: "--item-width", value: `${itemHeight * columnAspectRatio}px` },
		{ name: "--gap", value: `${gap}px` },
	].map(({ name, value }) => `${name}: ${value}`).join(";");

</script>

<div class="container" style={cssVars} bind:this={container}>
	<slot
		itemsPerPage={itemsPerPage}
		rowCount={rowCount}
		columnCount={columnCount}
	/>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
	}
</style>