<script lang="ts">
	import '../app.css';
	import isVertical from '$lib/stores/orientationStore.svelte';
	import Notifications from '$lib/components/Notifications/Notifications.svelte';

	const checkOrientation = () => {
		isVertical.set(!window.matchMedia('screen and (min-aspect-ratio: 1/1)').matches);
	};
</script>

<svelte:window onload={checkOrientation} onresize={checkOrientation} />

<Notifications />
<slot />