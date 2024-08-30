<script lang="ts">
	import releasesStore, { fetchMoreReleases } from '$lib/api/releases.svelte';
	import GridLayout from '$lib/components/Layouts/GridLayout.svelte';

	if (releasesStore.value.length == 0) {
		fetchMoreReleases();
	}
</script>


<GridLayout items={releasesStore.value} />
