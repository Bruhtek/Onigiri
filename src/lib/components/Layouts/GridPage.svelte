<script lang="ts">
	import BottomBar from '$lib/components/Navigation/BottomBar/BottomBar.svelte';
	import { onMount, type Snippet } from 'svelte';
	import DisplayPage, { possibleDisplays } from '$lib/stores/DisplayPage.svelte.js';
	import BottomBarSettingsPanel from '$lib/components/Navigation/BottomBar/BottomBarSettingsPanel.svelte';
	import type { DisplayType } from '$lib/stores/preferences/Display.svelte';

	interface Props {
		type: typeof possibleDisplays[number];
		leftPanel?: Snippet;
		rightPanel?: Snippet;
		showTotalPages?: boolean;

		currentDisplay?: DisplayType;
		onChangeDisplay?: (v: DisplayType) => void;
	}

	let props: Props = $props();

	onMount(() => {
		DisplayPage.patch({
			currentDisplay: props.type,
		});
		return () => {
			// for volumes, we don't really want to remember the pages
			if (props.type === 'VOLUMES') {
				DisplayPage.setPageForDisplay(0, 'VOLUMES');
			}
			DisplayPage.patch({
				currentDisplay: 'OTHER',
			});
		};
	});
</script>

<div class="slot">
	<slot />
</div>

<BottomBar showTotalPages={props.showTotalPages} leftPanel={props.leftPanel} rightPanel={props.rightPanel}>
	{#snippet settingsPanel()}
		<BottomBarSettingsPanel
			current={props.currentDisplay}
			onSelect={props.onChangeDisplay}
		/>
	{/snippet}
</BottomBar>

<style>
	.slot {
		flex: 1;
		overflow: hidden;
		position: relative;
	}
</style>
