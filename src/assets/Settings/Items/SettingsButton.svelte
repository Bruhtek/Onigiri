<script>
	import { SettingsIcon } from "svelte-feather-icons";

	export let toggleSettings = () => {};

</script>

<div class="icon-button settings-toggle" on:click={toggleSettings} on:keydown={toggleSettings}>
	<SettingsIcon />
</div>

<style>
	.icon-button {
		background-color: white;
		border-bottom: 2px solid black;
		border-right: 2px solid black;
		padding-right: 0.3rem;
		padding-top: 0.3rem;
		padding-left: 0.3rem;
		border-bottom-right-radius: 30%;
	}
	.settings-toggle {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>