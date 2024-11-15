<script lang="ts">
	import BottomBar from '$lib/components/Navigation/BottomBar/BottomBar.svelte';
</script>

<div class="slot">
	<slot />
</div>

<BottomBar />

<style>
	.slot {
		flex: 1;
		overflow: hidden;
		position: relative;
	}
</style>
