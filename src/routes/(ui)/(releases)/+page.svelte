<script lang="ts">
	import releasesStore, { fetchMoreReleases } from '$lib/api/releases.svelte';
	import GridLayout from '$lib/components/Layouts/GridLayout.svelte';

	if (releasesStore.value.length == 0) {
		fetchMoreReleases();
	}

	const items = $derived(releasesStore.value.filter((v) => v.type !== 'MANGA'));
</script>


<GridLayout items={items} />
