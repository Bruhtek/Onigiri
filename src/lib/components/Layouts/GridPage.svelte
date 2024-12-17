<script lang="ts">
	import BottomBar from '$lib/components/Navigation/BottomBar/BottomBar.svelte';
	import Number from '$lib/components/Inputs/Number.svelte';
	import PrefDisplay, { displayPreferencesDefaults } from '$lib/stores/preferences/Display.svelte';
	import isVertical from '$lib/stores/orientationStore.svelte';
	import { onMount, type Snippet } from 'svelte';
	import DisplayPage, { possibleDisplays } from '$lib/stores/DisplayPage.svelte.js';

	interface Props {
		type: typeof possibleDisplays[number];
		leftPanel: Snippet;
		rightPanel: Snippet;
	}

	let props: Props = $props();

	onMount(() => {
		DisplayPage.patch({
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
				current={PrefDisplay.v.gridColumnCountHorizontal}
				onChange={(v) => PrefDisplay.patch({gridColumnCountHorizontal: v})}
				defaultValue={displayPreferencesDefaults.gridColumnCountHorizontal}
				min={2}
				max={10}
				title={isVertical.value ? "Column count in landscape" : "Column count in landscape (now)"}
			/>
			<Number
				current={PrefDisplay.v.gridColumnCountVertical}
				onChange={(v) => PrefDisplay.patch({gridColumnCountVertical: v})}
				defaultValue={displayPreferencesDefaults.gridColumnCountVertical}
				min={2}
				max={10}
				title={isVertical.value ? "Column count in portrait (now)" : "Column count in portrait"}
			/>
			<Number
				current={PrefDisplay.v.gridObjectGap}
				onChange={(v) => PrefDisplay.patch({gridObjectGap: v})}
				defaultValue={displayPreferencesDefaults.gridObjectGap}
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
