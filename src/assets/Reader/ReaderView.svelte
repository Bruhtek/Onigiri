<script lang="ts">
	import { getPartContent } from "../../lib/jnovel";
	import Reader from "./Reader.svelte";

	export let partId: string;
	export let externalProgress: string = "0";
	let progress: number = parseFloat(externalProgress) || 0;

	let rawData: string = null;
	let inProgress = false;

	const fetchData = async () => {
		inProgress = true;
		rawData = await getPartContent(partId);
		inProgress = false;
	};
	$: if (!rawData && partId && !inProgress) {
		fetchData();
	}
</script>

<div class="container">
	{#if !rawData}
		Loading...
	{:else}
		<Reader {partId} raw={rawData} progress={progress} />
	{/if}
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
	}
</style>