<script lang="ts">
	import BottomBar from '$lib/components/Navigation/BottomBar/BottomBar.svelte';
	import Number from '$lib/components/Inputs/Number.svelte';
	import preferencesStore, { defaultPreferencesData } from '$lib/stores/preferencesStore.svelte';
	import isVertical from '$lib/stores/orientationStore.svelte';
	import { onMount, type Snippet } from 'svelte';
	import { pageProperties, possibleDisplays } from '$lib/stores/pageProperties.svelte';

	interface Props {
		type: typeof possibleDisplays[number];
		leftPanel: Snippet;
		rightPanel: Snippet;
	}

	let props: Props = $props();

	onMount(() => {
		pageProperties.patch({
			currentDisplay: props.type,
		});
	});

</script>

<div class="slot">
	<slot />
</div>

<BottomBar leftPanel={props.leftPanel} rightPanel={props.rightPanel}>
	{#snippet settingsPanel()}
		<div class="settings-panel">
			<h2>Settings</h2>
			<Number
				current={preferencesStore.value.columnCountHorizontal}
				onChange={(v) => preferencesStore.patch({columnCountHorizontal: v})}
				defaultValue={defaultPreferencesData.columnCountHorizontal}
				min={2}
				max={10}
				title={isVertical.value ? "Column count in landscape" : "Column count in landscape (now)"}
			/>
			<Number
				current={preferencesStore.value.columnCountVertical}
				onChange={(v) => preferencesStore.patch({columnCountVertical: v})}
				defaultValue={defaultPreferencesData.columnCountVertical}
				min={2}
				max={10}
				title={isVertical.value ? "Column count in portrait (now)" : "Column count in portrait"}
			/>
			<Number
				current={preferencesStore.value.gridObjectGap}
				onChange={(v) => preferencesStore.patch({gridObjectGap: v})}
				defaultValue={defaultPreferencesData.gridObjectGap}
				step={4}
				min={0}
				max={40}
				title="Padding"
			/>
		</div>
	{/snippet}
</BottomBar>

<style>
	.settings-panel {
		position: absolute;
		width: 100%;
		bottom: 3rem;
		left: 0;
		padding: 1rem;
		background-color: white;
		border-top: 2px solid var(--text);
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.slot {
		flex: 1;
		overflow: hidden;
		position: relative;
	}
</style>
