<script lang="ts">
	import '../app.css';
	import isVertical from '$lib/stores/orientationStore.svelte';
	import Notifications from '$lib/components/Notifications/Notifications.svelte';
	import { onMount } from 'svelte';

	const checkOrientation = () => {
		isVertical.set(!window.matchMedia('screen and (min-aspect-ratio: 1/1)').matches);
	};

	onMount(checkOrientation);
</script>

<title>Onigiri for J-Novel Club</title>

<svelte:window onload={checkOrientation} onresize={checkOrientation} />

<Notifications />
<slot />