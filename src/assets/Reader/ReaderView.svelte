<script lang="ts">
	import { useParams } from "svelte-navigator";
	import { getPartContent } from "../../lib/jnovel";
	import Reader from "./Reader.svelte";

	const params = useParams();

	let rawData: string = null;
	let inProgress = false;

	$: console.log($params);

	const fetchData = async () => {
		inProgress = true;
		rawData = await getPartContent($params.id);
		inProgress = false;
	};
	$: if (!rawData && $params.id && !inProgress) {
		fetchData();
	}
</script>

<div class="container">
	{#if !rawData}
		Loading...
	{:else}
		<Reader raw={rawData} />
	{/if}
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
	}
</style>