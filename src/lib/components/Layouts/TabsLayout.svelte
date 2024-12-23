<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	interface Props {
		tabs: Snippet[];
		tabLabels: Snippet[] | string[];
	}

	let selected = $state(0);
	let { tabs, tabLabels }: Props = $props();

	onMount(() => {
		if (tabs.length === 0 || tabs.length !== tabLabels.length) {
			throw new Error('Tabs and tabItems must have the same length');
		}
	});
</script>

<div class="container">
	<div class="content">
		{@render tabs[selected]()}
	</div>
	<div class="tabs">
		{#each tabLabels as label, i}
			<button class="tab"
					onclick={() => selected = i}
					class:selected={selected === i}
			>
				{#if typeof label === 'string'}
					{label}
				{:else}
					{@render label()}
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}

	.tabs {
		border-top: 3px solid var(--text);
		display: flex;
		justify-content: space-around;
		font-size: 1.2em;
		padding: 0.5rem;
	}

	.tab.selected {
		text-decoration: underline;
	}

	.content {
		flex-grow: 1;
		display: flex;
		min-height: 0;
		flex-direction: column;
	}
</style>