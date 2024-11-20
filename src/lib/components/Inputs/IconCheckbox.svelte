<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		onChange: (selected: boolean) => void;
		current: boolean;
		stateOn: Snippet;
		stateOff: Snippet;
	}

	let { onChange, current, stateOn, stateOff }: Props = $props();

	const onToggle = () => {
		onChange(!current);
	};
</script>

<button onclick={onToggle}>
	{#if current}
		{@render stateOn()}
	{:else}
		{@render stateOff()}
	{/if}
</button>


<style>

</style>