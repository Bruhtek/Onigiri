<script lang="ts">
	import { MinusIcon, PlusIcon } from "svelte-feather-icons";
	import { getStore, type Store, type StoreType } from "./Generic";
	import InputContainer from "./InputContainer.svelte";

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

<InputContainer>
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
</InputContainer>

<style>
	.minus :global(svg), .plus :global(svg) {
		padding-top: 4px;
	}
	p {
		padding-top: 3px;
	}
</style>