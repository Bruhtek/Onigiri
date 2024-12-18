<script lang="ts">
	import Checkbox from '$lib/components/Inputs/Checkbox.svelte';
	import PrefGeneral from '$lib/stores/preferences/General.svelte';
	import ButtonOption from '$lib/components/Inputs/ButtonOption.svelte';
	import { broadcastWithResponse, sendBroadcastMessage } from '$lib/lifecycle/serviceWorker';
	import type { ClearCachesMessage } from '$lib/types/broadcastMessageTypes';
	import Notifications from '$lib/stores/Notifications.svelte';
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
	<ButtonOption
		title="Clear Temporary Caches"
		shortTitle="CLEAR"
		onTap={() => {
			const msg: ClearCachesMessage = {
				type: 'ClearCachesMessage',
				all: false,
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
				all: true,
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
</div>

<style>
	.settings-container {
		text-align: left;
		width: 100%;
		margin: 1rem 0;
		font-size: 1.2rem;
	}
</style>