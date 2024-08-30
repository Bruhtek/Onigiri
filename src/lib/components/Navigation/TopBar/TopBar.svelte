<script lang="ts">
	import preferencesStore from '$lib/stores/preferencesStore.svelte';
</script>

<div class="top-bar" class:responsive={preferencesStore.value.verticalTabsWhileHorizontal}>
	Top Bar
</div>

<style>
	.top-bar {
		height: 3rem;
		border-bottom: 3px solid var(--text);

		&.responsive {
			@media screen and (min-aspect-ratio: 1/1) {
				border-right: 3px solid var(--text);
				border-bottom: none;
				height: 100%;
				width: 6rem;
			}
		}
	}
</style>