<script lang="ts">
	import Checkbox from '$lib/components/Inputs/Checkbox.svelte';
	import PrefGeneral from '$lib/stores/preferences/General.svelte';
</script>

<div class="settings-container">
	<Checkbox
		title="Place navigation on the side while horizontal"
		current={PrefGeneral.v.verticalTabsWhileHorizontal}
		onChange={(v) => PrefGeneral.patch({verticalTabsWhileHorizontal: v})}
	/>
	<Checkbox
		title="Dark Mode"
		current={PrefGeneral.v.darkMode}
		onChange={(v) => PrefGeneral.patch({darkMode: v})}
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