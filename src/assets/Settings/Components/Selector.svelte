<script lang="ts">
	import { getStore, type Store, type StoreType } from "./Generic";
	import InputContainer from "./InputContainer.svelte";

	export let storeType: StoreType;
	export let settingName: string;

	let store: Store;
	$: store = getStore(storeType);

	export let optionsMap: {[key: string]: string} = {};

	let opened = false;


	const selectOption = (option: string) => {
		$store[settingName] = option;
	}

	const toggleOpened = () => {
		opened = !opened;
	}
</script>

<InputContainer event={toggleOpened} fixedWidth={250}>
	<div class="current-option">
		<slot />: {optionsMap[$store[settingName]]}
	</div>
	<div class="options-container" class:opened={opened}>
		{#each Object.keys(optionsMap) as option}
			<div class="option" on:click={() => selectOption(option)}>{optionsMap[option]}</div>
		{/each}
	</div>
</InputContainer>

<style>
	.current-option {
		cursor: pointer;
	}

	.options-container {
		box-sizing: border-box;
		position: absolute;
		top: 100%;
		left: 0;
		background-color: #fff;
		border: 2px solid black;
		border-radius: 0 0 5px 5px;
		overflow: hidden;
		max-height: 0;
		width: 100%;
	}

	.options-container.opened {
		max-height: unset;
	}

	.option {
		text-align: center;
		padding: 5px;
		cursor: pointer;
	}

	.option:hover {
		background-color: #eee;
	}
</style>

