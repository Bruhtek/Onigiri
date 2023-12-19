<script lang="ts">
	import { getStore, type Store, type StoreType } from "./Generic";
	import InputContainer from "./InputContainer.svelte";

	export let storeType: StoreType;
	export let settingName: string;

	let store: Store;
	$: store = getStore(storeType);

	const toggle = () => {
		store.update((settings) => {
			settings[settingName] = !settings[settingName];
			return settings;
		});
	};
</script>

<InputContainer event={toggle}>
	<p>
		<slot />
	</p>
	<input type="checkbox" checked={$store[settingName]} />
</InputContainer>

<style>
	p {
		padding-top: 3px;
	}


	input {
		margin-left: 1rem;
	}
</style>