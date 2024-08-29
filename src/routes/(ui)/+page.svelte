<script lang="ts">
	import releasesStore, { fetchMoreReleases } from '$lib/api/releases.svelte';

	if (releasesStore.value.length == 0) {
		fetchMoreReleases();
	}
</script>


{#each releasesStore.value as release}
	<div>
		{release.title}
	</div>
{/each}

