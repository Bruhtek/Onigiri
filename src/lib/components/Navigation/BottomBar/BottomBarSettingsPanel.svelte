<script lang="ts">
	import PrefDisplay, {
		displayPreferencesDefaults, DisplayType,
	} from '$lib/stores/preferences/Display.svelte';
	import isVertical from '$lib/stores/orientationStore.svelte';
	import Number from '$lib/components/Inputs/Number.svelte';
	import TabsLayout from '$lib/components/Layouts/TabsLayout.svelte';

	interface DisplayTypeProps {
		current?: DisplayType;
		onSelect?: (v: DisplayType) => void;
	}

	const { current, onSelect }: DisplayTypeProps = $props();
</script>

<div class="settings-panel">
	<h2>Settings</h2>
	{#snippet gridSettings()}
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
	{/snippet}
	{#snippet listSettings()}
		<Number
			current={PrefDisplay.v.listMinObjectHeight}
			onChange={(v) => PrefDisplay.patch({listMinObjectHeight: v})}
			defaultValue={displayPreferencesDefaults.listMinObjectHeight}
			min={50}
			max={1000}
			step={10}
			title={"Minimum list item height"}
		/>
	{/snippet}
	{#if onSelect}
		<TabsLayout
			tabLabels={["Grid", "List (BETA)"]}
			tabs={[gridSettings, listSettings]}
			labelsOnTop={true}
			mainLabel="Display Layout"
			current={current}
			onSelect={onSelect}
		/>
	{:else}
		{#if current === DisplayType.Grid}
			{@render gridSettings()}
		{:else if current === DisplayType.List}
			{@render listSettings()}
		{/if}
	{/if}
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
</style>