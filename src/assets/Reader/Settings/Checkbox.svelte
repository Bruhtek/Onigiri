<script lang="ts">
	import { readerSettings } from "../../../lib/stores/settingsStore";

	export let settingName: string;

	const toggle = () => {
		readerSettings.update((settings) => {
			settings[settingName] = !settings[settingName];
			return settings;
		});
	};
</script>

<div class="container" on:click={toggle}>
	<p>
		<slot />
	</p>
	<input type="checkbox" checked={$readerSettings[settingName]} />
</div>

<style>
	p {
		padding-top: 3px;
	}
	.container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 15px;
		border: 2px solid #000;
		margin: 5px;
		height: 50px;
	}

	.container input {
		margin-left: 1rem;
	}
</style>