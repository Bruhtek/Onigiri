<script lang="ts">
	import SettingsButton from "./SettingsButton.svelte";

	export let position: "top" | "bottom";

	export let toggleSettings: (() => void) | undefined = undefined;
</script>

<div
	class="settings-modal"
	class:top={position === "top"}
	class:bottom={position === "bottom"}
	on:click|stopPropagation={() => {}}
	on:keydown|stopPropagation={() => {}}
>
	{#if toggleSettings}
		<SettingsButton {toggleSettings} />
	{/if}
	<slot />
</div>

<style>
	.settings-modal {
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-around;
		position: absolute;
		left: 0;
		min-height: 120px;
		height: max-content;
		width: 100%;
		padding: 0.3rem;
		font-size: 1.2rem;
		color: #000;
		background-color: #fff;
		border: 3px solid #000;
		flex-wrap: wrap;
	}
	.top {
		top: 0;
	}
	.bottom {
		bottom: 0;
	}
</style>