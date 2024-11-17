<script lang="ts">
	import preferencesStore from '$lib/stores/preferencesStore.svelte';
</script>

<div class="settings-container">
	<label>
		<input type="checkbox"
			   checked={preferencesStore.value.useCorsProxy}
			   onchange={() => preferencesStore.patch({useCorsProxy: !preferencesStore.value.useCorsProxy})}
		/>
		Use CORS Proxy
	</label>
</div>

<style>
	.settings-container {
		text-align: left;
		width: 100%;
		margin: 1rem 0;
		font-size: 1.2rem;
	}
</style>