<script lang="ts">
	import { MinusIcon, PlusIcon } from "svelte-feather-icons";
	import { getStore, type Store, type StoreType } from "./Generic";

	export let storeType: StoreType;
	export let settingName: string;

	let store: Store;
	$: store = getStore(storeType);

	export let min: number;
	export let max: number;

	export let step: number = 1;

	const increase = () => {
		store.update((settings) => {
			if (settings[settingName] < max) {
				settings[settingName] = parseInt(settings[settingName]) + step;
			}
			return settings;
		});
	};
	const decrease = () => {
		store.update((settings) => {
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
		{$store[settingName]}
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
</style>