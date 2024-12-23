<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { pushState, replaceState } from '$app/navigation';
	import { page } from '$app/stores';

	interface Props {
		tabs: Snippet[];
		tabLabels: Snippet[] | string[];
		labelsOnTop?: boolean;
		mainLabel?: string;
		current?: number;
		onSelect?: (index: number) => void;
		stateful?: boolean;
	}

	let { tabs, tabLabels, labelsOnTop = false, mainLabel, current, onSelect, stateful }: Props = $props();

	let selected = $state(0);

	$effect(() => {
		if (current) {
			selected = current;
		}
	});

	onMount(() => {
		if (tabs.length === 0 || tabs.length !== tabLabels.length) {
			throw new Error('Tabs and tabItems must have the same length');
		}
	});

	const onClick = (v: number) => {
		selected = v;
		if (onSelect) {
			onSelect(v);
		}
		if (stateful) {
			replaceState('', {
				selected: v,
			});
		}
	};

	onMount(() => {
		if (stateful) {
			const state = $page.state;
			if (state && state.selected) {
				selected = state.selected;
			}
		}
	});
</script>

<div class="container">
	{#if !labelsOnTop}
		<div class="content">
			{@render tabs[selected]()}
		</div>
	{/if}
	<div class="tabs"
		 class:top={labelsOnTop}
	>
		{#if mainLabel}
			<h5 class="main-label">
				{mainLabel}
			</h5>
		{/if}
		{#each tabLabels as label, i}
			<button class="tab"
					onclick={() => onClick(i)}
					class:selected={selected === i}
			>
				<span>
					{#if typeof label === 'string'}
						{label}
					{:else}
						{@render label()}
					{/if}
				</span>
			</button>
		{/each}
	</div>
	{#if labelsOnTop}
		<div class="content">
			{@render tabs[selected]()}
		</div>
	{/if}
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

	.tabs.top {
		border-top: none;
		border-bottom: 3px solid var(--text);
	}

	.main-label {
		flex: 1;
	}

	.tab {
		flex: 1;
		text-align: center;
	}

	.tab.selected {
		color: var(--bg);
		background-color: var(--text);
		border-radius: 0.5rem;
	}

	.content {
		flex-grow: 1;
		display: flex;
		min-height: 0;
		flex-direction: column;
	}
</style>