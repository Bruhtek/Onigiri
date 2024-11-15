<script lang="ts">
	import releasesStore, { fetchMoreReleases } from '$lib/api/releases.svelte';
	import GridLayout from '$lib/components/Layouts/GridLayout.svelte';

	if (releasesStore.value.length == 0) {
		fetchMoreReleases();
	}

	// we are now able to skip this, since we have type query parameter in requests
	// const items = $derived(releasesStore.value.filter((v) => v.type !== 'MANGA'));
</script>


<GridLayout items={releasesStore.value} />
