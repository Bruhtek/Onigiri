<script lang="ts">

	import { changeReleasesPage, releasesPageProperties } from '$lib/api/releases.svelte';
</script>

<div class="bottom-bar">
	<div class="page-data">
		<button class="button-left" onclick={() => changeReleasesPage(-1)}>
			Previous
		</button>
		<span>{releasesPageProperties.value.page + 1}</span>
		<button class="button-right" onclick={() => changeReleasesPage(1)}>
			Next
		</button>
	</div>
</div>

<style>
	.bottom-bar {
		display: flex;
		height: 3rem;
		place-content: center;
	}

	.page-data {
		display: flex;
		gap: 1rem;
	}
</style>