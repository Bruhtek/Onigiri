<script lang="ts">
	import '../app.css';
	import isVertical from '$lib/stores/orientationStore.svelte';
	import Notifications from '$lib/components/Notifications/Notifications.svelte';
	import { onMount } from 'svelte';
	import connectivityCheck from '$lib/helpers/useConnectivityCheck.svelte';
	import FullScreenDialog from '$lib/components/Inputs/FullScreenDialog.svelte';
	import init from '$lib/lifecycle/init';
	import PrefGeneral from '$lib/stores/preferences/General.svelte';
	import { afterNavigate } from '$app/navigation';
	import previousUrl from '$lib/stores/previousUrl.svelte';

	const onInit = () => {
		init();
		checkOrientation();
	};
	const checkOrientation = () => {
		isVertical.set(!window.matchMedia('screen and (min-aspect-ratio: 1/1)').matches);
	};

	afterNavigate((navigation) => {
		previousUrl.set((navigation.from && navigation.from.url && navigation.from?.url.toString()) || '');
	});

	onMount(onInit);
</script>

<title>Onigiri for J-Novel Club</title>

<svelte:window
	onload={checkOrientation}
	onresize={checkOrientation}
	use:connectivityCheck
/>

<div class="content"
	 class:dark={PrefGeneral.v.darkMode}
>
	<FullScreenDialog />
	<Notifications />
	<slot />
</div>

<style>
	.content {
		display: block;
		width: 100%;
		height: 100%;
		--bg: #fff;
		--text: #000;
		background-color: var(--bg);
		color: var(--text);
	}

	.content.dark {
		--bg: #000;
		--text: #fff;
	}
</style>