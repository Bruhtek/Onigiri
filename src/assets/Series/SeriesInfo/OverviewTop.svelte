<script lang="ts">
	import type { SeriesAggregate } from "../../../lib/types/Series";
	import { getSeriesAuthor } from "../../../lib/types/Series";

	export let data: SeriesAggregate;
</script>

<div class="top">
	<img src={data.series.coverURL} alt={data.series.title + " cover"} />
	<div class="aside">
		<h1 class="title">
			{data.series.title}
		</h1>
		<div class="info">
			<p>Autor: {getSeriesAuthor(data)}</p>
			<p>Created: {
				data.series.created.toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				})
			}</p>
			<p>Volume count: {data.volumes.length}</p>
			<p>Total part count: {data.volumes.reduce((sum, volume) => sum + volume.parts.length, 0)}</p>
			<p>Tags: {data.series.tags.join(', ')}</p>
		</div>
	</div>
</div>

<style>
	.top {
		width: 100%;
		min-height: 50%;
		border-bottom: 3px solid black;
		padding-bottom: 1rem;
		display: flex;
		gap: 1rem;
	}
	.aside {
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.info {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		/*justify-content: space-between;*/
	}
	.top img {
		height: 100%;
		border-radius: 1rem;
		object-fit: contain;
	}
	.title {
		display: block;
		font-size: 1.3rem;
		border-bottom: 2px solid black;
		margin-bottom: 5px;
		padding-bottom: 5px;
	}

</style>
