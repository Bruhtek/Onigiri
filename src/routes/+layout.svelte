<script lang="ts">
	import isVertical from '$lib/stores/orientationStore.svelte';

	const checkOrientation = () => {
		isVertical.set(!window.matchMedia('screen and (min-aspect-ratio: 1/1)').matches);
	};
</script>

<svelte:window onresize={checkOrientation} />

<slot />