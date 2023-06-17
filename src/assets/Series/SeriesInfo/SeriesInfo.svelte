<script lang="ts">
	import { getSeriesAggregateById } from "../../../lib/stores/seriesStore";
	import type { SeriesAggregate } from "../../../lib/types/Series";
	import { onMount } from "svelte";
	import { Route } from "svelte-navigator";
	import Volumes from "./Volumes.svelte";
	import Navbar from "../../Navbar/Navbar.svelte";
	import Overview from "./Overview.svelte";

	export let seriesId: string = "";

	let data: SeriesAggregate | null = null;

	const getSeries = async () => {
		data = await getSeriesAggregateById(seriesId)
	}

	onMount(() => {
		getSeries();
	})

	const navItems = {
		"": "Overview",
		"volumes": "Volumes",
	}
</script>

{#if data}
	<div class="container">
		<Navbar items={navItems} forwardUrl={null} backUrl="/series" />
		<div class="content">
			<Route path="/">
				<Overview data={data} />
			</Route>
			<Route path="/volumes">
				<Volumes data={data} />
			</Route>
		</div>
	</div>
{:else}
	<p>Loading...</p>
{/if}

<style>
	.container {
		height: 100%;
		width: 100%;
	}
	.content {
		padding: 1rem;
		width: 100%;
		height: calc(100% - 50px);
		box-sizing: border-box;
	}
</style>

