<script lang="ts">
	import type { TapAction } from '$lib/stores/readerPreferencesStore.svelte';

	interface Props {
		action: TapAction;
	}

	const actionToName = {
		'PT': 'Previous',
		'ST': 'Settings',
		'NT': 'Next',
		'XT': 'Nothing',
	};

	let props: Props = $props();

	let actionName = $derived.by(() => {
		if (['PT', 'ST', 'NT', 'XT'].includes(props.action)) {
			return actionToName[props.action as 'PT' | 'ST' | 'NT' | 'XT'];
		}
		return '';
	});
</script>

<div class={"tap-action " + props.action[0]}>
	{#if actionName}
		<p class="name">{actionName}</p>
	{/if}
</div>

<style>
	.tap-action {
		display: flex;
		place-content: center;
		place-items: center;
		text-shadow: white 0 0 4px;
	}

	.P {
		background-color: #000c;
		color: white;
	}

	.S {
		background-color: #aaac;
	}

	.N {
		background-color: #666c;
	}

	.X {
		background-color: #fffc;
	}
</style>