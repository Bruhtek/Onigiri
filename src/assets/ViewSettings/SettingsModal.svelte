<script lang="ts">

	import { SettingsIcon } from "svelte-feather-icons";
<<<<<<< HEAD:src/assets/ViewSettings/SettingsModal.svelte
	import Numerical from "./Numerical.svelte";
	import Checkbox from "./Checkbox.svelte";
=======
	import Numerical from "./Settings/Numerical.svelte";
	import Checkbox from "./Settings/Checkbox.svelte";
<<<<<<< HEAD:src/assets/ViewSettings/SettingsModal.svelte
>>>>>>> master:src/assets/Releases/SettingsModal.svelte
=======
>>>>>>> master:src/assets/Releases/SettingsModal.svelte

	export let toggleSettings = () => {};
</script>

<div class="settings-modal">
	<div class="icon-button settings-toggle" on:click={toggleSettings}>
		<SettingsIcon />
	</div>
	<Numerical settingName="columnSize" step="10" min="80" max="300">
		Min. Column Size
	</Numerical>
	<Numerical settingName="columnGap" step="1" min="0" max="40">
		Gap
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