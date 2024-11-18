<script lang="ts">
	import preferencesStore from '$lib/stores/preferencesStore.svelte';
	import Checkbox from '$lib/components/Inputs/Checkbox.svelte';
</script>

<div class="settings-container">
	<Checkbox
		title="Place navigation on the side while horizontal"
		current={preferencesStore.value.verticalTabsWhileHorizontal}
		onChange={(v) => preferencesStore.patch({verticalTabsWhileHorizontal: v})}
	/>
	<Checkbox
		title="Dark Mode"
		current={preferencesStore.value.darkMode}
		onChange={(v) => preferencesStore.patch({darkMode: v})}
	/>
</div>

<style>
	.settings-container {
		text-align: left;
		width: 100%;
		margin: 1rem 0;
		font-size: 1.2rem;
	}
</style>