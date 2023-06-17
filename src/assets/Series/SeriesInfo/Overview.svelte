<script lang="ts">
	import type { SeriesAggregate } from "../../../lib/types/Series";
	import OverviewTop from "./OverviewTop.svelte";

	export let data: SeriesAggregate;
</script>

<div class="overview">
	<OverviewTop {data} />
	<div class="bottom content">
		<h3>
			Summary
		</h3>
		<p>
			{data.series.description}
		</p>
	</div>
</div>

<style>
	.overview {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.bottom {
		margin-top: 0.5rem;
		flex-grow: 1;
		flex-shrink: 0;
	}
	@media (min-width: 1000px) {
		.bottom {
			display: none;
		}
	}
</style>