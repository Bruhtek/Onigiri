<script lang="ts">
	import Checkbox from '$lib/components/Inputs/Checkbox.svelte';
	import PrefGeneral from '$lib/stores/preferences/General.svelte';
	import ButtonOption from '$lib/components/Inputs/ButtonOption.svelte';
	import { broadcastWithResponse, sendBroadcastMessage } from '$lib/lifecycle/serviceWorker';
	import type { ClearCachesMessage } from '$lib/types/broadcastMessageTypes';
	import Notifications from '$lib/stores/Notifications.svelte';
	import HrWithText from '$lib/components/Utils/HrWithText.svelte';
	import PrefDisplay from '$lib/stores/preferences/Display.svelte';
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
	<Checkbox
		title="Use high quality thumbnails"
		current={PrefDisplay.v.hdThumbnails}
		onChange={(v) => PrefDisplay.patch({hdThumbnails: v})}
	/>
	<HrWithText>Advanced</HrWithText>
	<ButtonOption
		title="Clear Temporary Caches"
		shortTitle="CLEAR"
		onTap={() => {
			const msg: ClearCachesMessage = {
				type: 'ClearCachesMessage',
				which: 'temporary',
			}
			sendBroadcastMessage(msg);
		}}
	/>
	<ButtonOption
		title="Clear ALL Caches and refresh service worker"
		shortTitle="CLEAR"
		onTap={() => {
			const msg: ClearCachesMessage = {
				type: 'ClearCachesMessage',
				which: 'all',
			}
			broadcastWithResponse(msg, 1000).then((res) => {
				if(typeof res === 'object' && res && 'status' in res && res['status']) {
					window.location.reload();
				} else {
					Notifications.error("Error clearing caches");
				}
			});

		}}
	/>
	{#if import.meta.env.DEV}
		<Checkbox
			title="DEVELOPMENT: Use CORS proxy"
			current={PrefGeneral.v.corsProxy}
			onChange={(v) => PrefGeneral.patch({corsProxy: v})}
		/>
	{/if}
</div>

<style>
	.settings-container {
		text-align: left;
		width: 100%;
		margin: 1rem 0;
		font-size: 1.2rem;
	}
</style>