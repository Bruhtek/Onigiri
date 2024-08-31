<script lang="ts">
	import type { LayoutItemProp } from '$lib/types/LayoutItem';

	interface GridLayoutProps {
		item: LayoutItemProp;
	}

	let { item }: GridLayoutProps = $props();

	let actualItem = $derived.by(() => {
		if ('toLayoutItem' in item) {
			return item.toLayoutItem();
		}
		return item;
	});
</script>

<div class="item">
	<p>
		{actualItem.title}
	</p>
	<p>
		{actualItem.indexesFunction()}
	</p>
</div>

<style>
	.item {
		background-color: black;
		color: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		line-height: 100%;
		aspect-ratio: var(--column-aspect-ratio);
	}
</style>