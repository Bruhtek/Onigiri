<script lang="ts">
	import TopBar from '$lib/components/Navigation/TopBar/TopBar.svelte';

	import preferencesStore from '$lib/stores/preferencesStore.svelte';
</script>

<div class="container" class:responsive={preferencesStore.value.verticalTabsWhileHorizontal}>
	<TopBar />

	<div class="content">
			<slot />
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100dvh;
		overflow: hidden;

		&.responsive {
			@media screen and (min-aspect-ratio: 1/1) {
				flex-direction: row;
			}
		}
	}

	.content {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
</style>