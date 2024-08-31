<script lang="ts">

	import { releasesPageProperties } from '$lib/api/releases.svelte';
</script>

<div class="bottom-bar">
	<span>{releasesPageProperties.value.page}</span>
</div>

<style>
	.bottom-bar {
		display: flex;
		height: 3rem;
		place-content: center;
	}
</style>