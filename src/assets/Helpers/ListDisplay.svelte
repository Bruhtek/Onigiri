<script lang="ts">
	import { viewSettings } from "../../lib/stores/settingsStore";
	import { listItemsPerPage } from "../../lib/stores/seriesStore";

	$: minRowHeight = $viewSettings.rowHeight;

	let container: HTMLDivElement = null;

	let availableHeight: number = 0;

	let itemsPerPage: number = 0;
	let rowCount = 0;
	const gap = 10;
	let itemHeight: number = 0;

	$: if (container && $viewSettings.rowHeight && minRowHeight) {
		calculate();
	}

	const calculate = () => {
		availableHeight = container?.clientHeight;
		rowCount = Math.floor(availableHeight / (minRowHeight + gap));
		itemHeight = Math.floor(availableHeight / rowCount);
		itemsPerPage = rowCount;
		listItemsPerPage.set(itemsPerPage);
	}

	$: cssVars = [
		{ name: "--item-height", value: `${itemHeight}px` },
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