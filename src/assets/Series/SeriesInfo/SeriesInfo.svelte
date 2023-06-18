<script lang="ts">
	import { getSeriesAggregateById, seriesAggregate, volumesPage } from "../../../lib/stores/seriesStore";
	import { onMount } from "svelte";
	import { Route } from "svelte-navigator";
	import Volumes from "./Volumes/VolumesList.svelte";
	import VolumesList from "./Volumes/VolumesList.svelte";
	import Navbar from "../../Navbar/Navbar.svelte";
	import Overview from "./Overview/Overview.svelte";
	import { get } from "svelte/store";

	export let seriesId: string = "";



	const getSeries = async () => {
		const res = await getSeriesAggregateById(seriesId)
		seriesAggregate.set(res);
	}

	onMount(() => {
		if(get(seriesAggregate) && get(seriesAggregate).series.id === seriesId) return;
		seriesAggregate.set(null);
		getSeries();
		volumesPage.set(0)
	})

	const navItems = {
		"": "Overview",
		"volumes": "Volumes",
	}
</script>

{#if $seriesAggregate}
	<div class="container">
		<Navbar items={navItems} forwardUrl={null} backUrl="/series" />
		<div class="content">
			<Route path="/">
				<Overview data={$seriesAggregate} />
			</Route>
			<Route path="/volumes">
				<VolumesList data={$seriesAggregate} />
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

