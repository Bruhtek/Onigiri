<script lang="ts" generics="Val extends unknown">
	import type { Snippet } from 'svelte';

	interface Props {
		options: Val[];
		readableOptions: string[];
		onSelect: (selected: Val) => void;
		current: Val;
		displaySnippet?: Snippet<[Val]>;
		title: string;
	}

	let { options, readableOptions, onSelect, current, title, displaySnippet }: Props = $props();

	let correct = $derived(options.length === readableOptions.length);

	$effect(() => {
		if (!correct) {
			console.error('Incorrect select arrays!');
		}
	});
</script>

<div class="container">
	<div class="title">
		{title}
	</div>
	<div class="options">
		{#if correct}
			{#each options as option, i}
				<button class="button"
						class:current={option === current}
						onclick={() => onSelect(option)}
				>
					{#if displaySnippet}
						{@render displaySnippet(option)}
					{:else}
						{readableOptions[i]}
					{/if}
				</button>
			{/each}
		{:else}
			Incorrect arrays! Message the developer!
		{/if}
	</div>
</div>

<style>
	.title {
		font-size: 1.15em;
	}

	.options {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.button {
		border-radius: 0.5rem;
	}

	.current {
		background-color: var(--text);
		color: var(--bg);
	}
</style>