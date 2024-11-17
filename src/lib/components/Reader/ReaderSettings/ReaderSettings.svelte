<script lang="ts">
	import SettingsTop from '$lib/components/Reader/ReaderSettings/SettingsTop.svelte';
	import SettingsBottom from '$lib/components/Reader/ReaderSettings/SettingsBottom.svelte';
	import type { PartTocResult } from '$lib/api/parts.svelte';

	interface Props {
		onHide: () => unknown;
		toggleZones: (state: boolean) => unknown;
		partTocResult: PartTocResult | { error: string };
	}

	let props: Props = $props();

	const onDisable = (e: Event) => {
		console.log('On settings disable');
		e.preventDefault();
		e.stopImmediatePropagation();
		e.stopPropagation();
		props.onHide();
	};
</script>

<div class="container"
>
	<div class="background"
		 onclick={onDisable}
		 onkeydown={(e: KeyboardEvent) => {
		if(e.key === "Escape") {
			onDisable(e);
		}
	}}
		 role="button"
		 tabindex="0"
	></div>
	<div class="top">
		<SettingsTop partTocResult={props.partTocResult}
		/>
	</div>
	<div class="bottom">
		<SettingsBottom toggleZones={props.toggleZones} />
	</div>
</div>

<style>
	.container {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 50;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
	}

	.background {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 0;
	}

	.top, .bottom {
		display: flex;
		flex-direction: column;
		gap: 4px;
		background-color: var(--bg);
		z-index: 10;
		padding: 8px;
	}

	.top {
		border-bottom: 2px solid var(--text);
	}

	.bottom {
		border-top: 2px solid var(--text);
		flex-direction: row;
	}
</style>