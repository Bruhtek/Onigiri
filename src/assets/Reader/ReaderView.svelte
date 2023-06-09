<script lang="ts">
	import { useParams } from "svelte-navigator";
	import { getPartData } from "../../lib/jnovel";
	import Reader from "./Reader.svelte";

	const params = useParams();

	let rawData: string = null;
	let inProgress = false;

	$: console.log($params);

	const fetchData = async () => {
		inProgress = true;
		rawData = await getPartData($params.id);
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