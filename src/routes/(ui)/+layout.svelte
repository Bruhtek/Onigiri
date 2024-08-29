<script lang="ts">
	import '../../app.css';
	import Notifications from '$lib/components/Notifications/Notifications.svelte';
	import TopBar from '$lib/components/Navigation/TopBar/TopBar.svelte';
	import BottomBar from '$lib/components/Navigation/BottomBar/BottomBar.svelte';
</script>

<div class="container">
	<TopBar />

	<div class="content">
		<Notifications />

		<slot />
	</div>

	<BottomBar />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100dvh;
		overflow: hidden;
	}

	.content {
		flex: 1;
		overflow: hidden;
		position: relative;
	}
</style>