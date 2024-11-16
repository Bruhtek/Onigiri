<script lang="ts">
	import { mapTapZones, type TapZone } from '$lib/stores/readerPreferencesStore.svelte';
	import ReaderZone from '$lib/components/Reader/ReaderZone.svelte';

	interface Props {
		tapZone: TapZone,
		onTap: () => void;
	}

	let props: Props = $props();

	let actions = $derived(mapTapZones(props.tapZone));
</script>

<div class="container"
	 onclick={props.onTap}
	 onkeydown={(e: KeyboardEvent) => {
		if(e.key === "Escape") {
			props.onTap();
		}
	}}
	 role="button"
	 tabindex="0"
>
	{#each actions as row}
		{#each row as a}
			<ReaderZone action={a} />
		{/each}
	{/each}
</div>

<style>
	.container {
		display: grid;
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		grid-template-rows: 1fr 1fr 1fr;
		grid-template-columns: 1fr 1fr 1fr;
	}
</style>