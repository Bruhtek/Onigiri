<script lang="ts">

	import { SettingsIcon } from "svelte-feather-icons";
	import Numerical from "./Numerical.svelte";
	import Checkbox from "./Checkbox.svelte";

	export let toggleSettings = () => {};
</script>

<div class="settings-modal">
	<div class="icon-button settings-toggle" on:click={toggleSettings} on:keydown={toggleSettings}>
		<SettingsIcon />
	</div>
	<Numerical settingName="columnCount" step={1} min={1} max={10}>
		Column Count
	</Numerical>
	<Checkbox settingName="highCoverQuality">
		High Quality Cover
	</Checkbox>
</div>

<style>
	.icon-button {
		padding-top: 5px;
	}
	.settings-toggle {
		position: absolute;
		top: 0;
		left: 5px;
	}
	.settings-modal {
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-around;
		position: absolute;
		bottom: 0;
		left: 0;
		height: 25%;
		width: 100%;
		padding: 0.3rem;
		font-size: 1.2rem;
		color: #000;
		background-color: #fff;
		border: 3px solid #000;
		flex-wrap: wrap;
	}
</style>