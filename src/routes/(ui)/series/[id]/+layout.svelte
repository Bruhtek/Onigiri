<script lang="ts">
	import type { PageData } from './$types';
	import { untrack } from 'svelte';
	import Series from '$lib/api/Series.svelte';

	let { data }: { data: PageData } = $props();

	$effect(() => {
		const id = data.seriesId;
		untrack(() => {
			Series.fetchSeriesDetails(id);
		});
	});

</script>

<slot />