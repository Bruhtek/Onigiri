<script lang="ts">
	import { changeReleasesPage, releasesPageProperties } from '$lib/api/releases.svelte';

	import ArrowRight from '~icons/ph/arrow-right';
	import ArrowLeft from '~icons/ph/arrow-left';
</script>

<div class="bottom-bar">
	<div class="page-data">
		<button class="button-left" onclick={() => changeReleasesPage(-1)}>
			<ArrowLeft width="32" height="32" />
		</button>
		<span>{releasesPageProperties.value.page + 1}</span>
		<button class="button-right" onclick={() => changeReleasesPage(1)}>
			<ArrowRight width="32" height="32" />
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
		align-items: center;
		align-content: center;
		gap: 1rem;
	}

	span {
		font-size: 1.3rem;
		padding-bottom: 0.2rem;
	}
</style>