<script lang="ts">
	import type { SeriesAggregate } from "../../../lib/types/Series";
	import OverviewTop from "./OverviewTop.svelte";

	export let data: SeriesAggregate;
</script>

<OverviewTop {data} />
<div class="bottom content">
	<h3>
		Summary
	</h3>
	<p>
		{data.series.description}
	</p>
</div>