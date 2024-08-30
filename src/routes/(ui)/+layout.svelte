<script lang="ts">
	import '../../app.css';
	import Notifications from '$lib/components/Notifications/Notifications.svelte';
	import TopBar from '$lib/components/Navigation/TopBar/TopBar.svelte';
	import BottomBar from '$lib/components/Navigation/BottomBar/BottomBar.svelte';

	import preferencesStore from '$lib/stores/preferencesStore.svelte';
</script>

<div class="container" class:responsive={preferencesStore.value.verticalTabsWhileHorizontal}>
	<TopBar />

	<div class="content">
		<div class="slot">
			<Notifications />

			<slot />
		</div>

		<BottomBar />
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100dvh;
		overflow: hidden;

		&.responsive {
			@media screen and (min-aspect-ratio: 1/1) {
				flex-direction: row;
			}
		}
	}

	.content {
		flex: 1;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.slot {
		flex: 1;
		overflow: hidden;
		position: relative;
	}
</style>