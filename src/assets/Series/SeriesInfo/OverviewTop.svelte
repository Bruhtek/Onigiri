<script lang="ts">
	import type { SeriesAggregate } from "../../../lib/types/Series";
	import { getSeriesAuthor } from "../../../lib/types/Series";
	import toProperCase from "../../../lib/utils/toProperCase";

	export let data: SeriesAggregate;
</script>

<div class="top">
	<img src={data.series.coverURL} alt={data.series.title + " cover"} />
	<div class="aside">
		<h1 class="title">
			{data.series.title}
		</h1>
		<div class="info">
			<p><b>Type: {toProperCase(data.series.type)}</b></p>
			{#if data.series.type === "MANGA"}
				<h3 class="padding">Warning: Manga reading is currently not supported!!</h3>
			{/if}
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
		<div class="description">
			<h3>Summary</h3>
			{data.series.description}
		</div>
	</div>
</div>

<style>
	.top {
		width: 100%;
		min-height: 30%;
		height: 60%;
		border-bottom: 3px solid black;
		padding-bottom: 1rem;
		display: flex;
		gap: 1rem;
		flex-grow: 1;

		/*flex-shrink: 0;*/
	}
	.padding {
		padding: 0.5rem;
		border: 2px solid black;
		text-align: center;
		margin-bottom: 0.5rem;
		margin-top: 0.5rem;
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
		border: 2px solid black;
	}
	.title {
		display: block;
		font-size: 1.3rem;
		border-bottom: 2px solid black;
		margin-bottom: 5px;
		padding-bottom: 5px;
	}
	.description {
		display: none;
	}
	@media (min-width: 1000px) {
		.top {
			height: 100%;
			border-bottom: none;
		}
		.info {
			flex-grow: 0;
			margin-bottom: 5px;
			padding-bottom: 5px;
			border-bottom: 2px solid black;
		}
		.description {
			display: block;
			flex-grow: 1;
		}
	}
</style>
