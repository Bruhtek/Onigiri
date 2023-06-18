<script lang="ts">
	import { viewSettings } from "../../lib/stores/settingsStore";
	import { gridItemsPerPage as ipp } from "../../lib/stores/seriesStore";

	$: minColumnWidth = $viewSettings.columnSize;

	const columnAspectRatio = 2 / 3;
	$: gap = $viewSettings.gap;

	let container: HTMLDivElement = null;

	let availableWidth: number = 0;
	let availableHeight: number = 0;

	let itemsPerPage: number = 0;
	let rowCount = 0;
	let columnCount = 0;
	let itemHeight: number = 0;

	$: if (container) {
		calculate();
	}

	const calculate = () => {
		availableWidth = container?.clientWidth;
		availableHeight = container?.clientHeight;

		columnCount = Math.floor(availableWidth / (minColumnWidth + gap));

		const columnWidth = (availableWidth - (columnCount - 1) * gap) / columnCount;
		itemHeight = columnWidth / columnAspectRatio;
		rowCount = Math.floor(availableHeight / (itemHeight + gap));

		itemsPerPage = columnCount * rowCount;
		ipp.set(itemsPerPage);
	}

	$: cssVars = [
		{ name: "--item-height", value: `${itemHeight}px` },
		{ name: "--item-width", value: `${itemHeight * columnAspectRatio}px` },
		{ name: "--gap", value: `${gap}px` },
	].map(({ name, value }) => `${name}: ${value}`).join(";");


	const resizeObserver = el => {
		const resizeObserver = new ResizeObserver(entries => {
			calculate();
		});

		resizeObserver.observe(el);

		return {
			destroy: () => {
				resizeObserver.disconnect();
			}
		}
	}
</script>

<div class="grid-display" style={cssVars} use:resizeObserver bind:this={container}>
	<slot
		itemsPerPage={itemsPerPage}
		rowCount={rowCount}
		columnCount={columnCount}
	/>
</div>

<style>
	.grid-display {
		width: calc(100% - var(--gap) * 2);
		height: calc(95% - var(--gap) * 2);
		margin-left: var(--gap);
		margin-top: var(--gap);
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
	}
</style>