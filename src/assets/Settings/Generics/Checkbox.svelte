<script lang="ts">
	import { getStore, type Store, type StoreType } from "./Generic";

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

<div class="container" on:click={toggle} on:keydown={toggle}>
	<p>
		<slot />
	</p>
	<input type="checkbox" checked={$store[settingName]} />
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