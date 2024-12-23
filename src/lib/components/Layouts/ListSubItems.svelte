<script lang="ts">
	import type { LayoutItemProp } from '$lib/types/LayoutItem';
	import { page } from '$app/stores';

	interface Props {
		items: LayoutItemProp[];
	}

	let { items }: Props = $props();

	let actualItems = $derived(items.map(item => {
		if ('toLayoutItem' in item) {
			return item.toLayoutItem();
		}
		return item;
	}));
</script>

<div class="container">
	{#each actualItems as item, i}
		<a
			href={typeof item.href === 'string' ? item.href : item.href($page.url.pathname)}
			class="item"
			class:disabled={item.disabled}
			style="--progress: {item.progress || 0}"
		>
			<div class="item-bg"></div>
			<div class="item-text">{i + 1}</div>
		</a>
	{/each}
</div>

<style>
	.container {
		display: flex;
		margin-left: auto;
		font-size: 1.1em;
	}

	.item {
		border-top: 2px solid var(--text);
		border-left: 2px solid var(--text);
		aspect-ratio: 1/1;
		display: inline-grid;
		place-items: center;
		height: 2em;
		position: relative;
	}
	.item.disabled {
		pointer-events: none;
		opacity: 0.5;
	}
	.item.disabled .item-text {
		color: var(--text);
	}

	.item-bg {
		position: absolute;
		height: 100%;
		width: calc(var(--progress) * 100%);
		background-color: var(--text);
		left: 0;
		top: 0;
	}
	.item-text {
		mix-blend-mode: difference;
		z-index: 10;
		color: white;
	}
</style>