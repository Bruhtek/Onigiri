<script lang="ts">
	import { viewSettings } from "../../lib/stores/settingsStore";
	import { MinusIcon, PlusIcon } from "svelte-feather-icons";

	export let settingName: string;

	export let min: number;
	export let max: number;

	export let step: number = 1;

	const increase = () => {
		viewSettings.update((settings) => {
			if (settings[settingName] < max) {
				settings[settingName] = parseInt(settings[settingName]) + parseInt(step.toString());
			}
			return settings;
		});
	};
	const decrease = () => {
		viewSettings.update((settings) => {
			if (settings[settingName] > min) {
				settings[settingName] -= step;
			}
			return settings;
		});
	};
</script>

<div class="container">
	<div class="minus" on:click={decrease} on:keydown={decrease}>
		<MinusIcon size="2x" />
	</div>
	<p>
		<slot />
		:
		{$viewSettings[settingName]}
	</p>
	<div class="plus" on:click={increase} on:keydown={increase}>
		<PlusIcon size="2x" />
	</div>
</div>

<style>
	.container :global(svg) {
		padding-top: 4px;
	}
	p {
		padding-top: 3px;
	}
	.container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 5px;
		border: 2px solid #000;
		margin: 5px;
		height: 50px;
	}

	.container input {
		margin-left: 1rem;
	}
</style>