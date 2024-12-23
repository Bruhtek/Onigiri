<script lang="ts">
	import type { LayoutItemProp } from '$lib/types/LayoutItem';
	import PrefDisplay from '$lib/stores/preferences/Display.svelte';
	import Reader from '$lib/components/Reader/Reader.svelte';
	import PrefReader from '$lib/stores/preferences/Reader.svelte';
	import ListSubItems from '$lib/components/Layouts/ListSubItems.svelte';

	interface GridLayoutProps {
		item: LayoutItemProp;
		secondaryItems?: LayoutItemProp[];
	}

	let { item, secondaryItems = [] }: GridLayoutProps = $props();

	let actualItem = $derived.by(() => {
		if ('toLayoutItem' in item) {
			return item.toLayoutItem();
		}
		return item;
	});
</script>

<div class="item"
	 class:disabled={actualItem.disabled}
>
	{#if !PrefDisplay.v.hdThumbnails}
		{#key actualItem.imageSrc}
			<img class="image-obj" src={actualItem.imageSrc} alt={actualItem.title} />
		{/key}
	{:else}
		{#key actualItem.HDImageSrc || actualItem.imageSrc}
			<img class="image-obj" src={actualItem.HDImageSrc || actualItem.imageSrc} alt={actualItem.title} />
		{/key}
	{/if}
	<div class="right">
		<h3 class="title">
			{#if actualItem.titleWithoutIndexes}
				{actualItem.titleWithoutIndexes()}
			{:else}
				{actualItem.title}
			{/if}
		</h3>
		{#if actualItem.description}
			<div class="description">
				<Reader
					minimal={true}
					content={"<p>" + actualItem.description + "</p>"}
					toggleZones={() => {}}
					partTocResult={{ error: "" }}
					loading={false}
					id={Math.random().toString(16)}
					overrideFontSize={Math.floor(PrefReader.v.fontSize * 0.9)}
				/>
			</div>
		{/if}
		{#if secondaryItems.length}
			<ListSubItems items={secondaryItems} />
		{/if}
	</div>
</div>

<style>
	.item {
		background-color: var(--bg);
		color: var(--text);
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		position: relative;
		border: 3px solid var(--text);
		border-color: var(--text);
		user-select: none;
		width: 100%;
		overflow: hidden;
	}

	.item.disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	.image-obj {
		height: 100%;
		min-height: 0;
		display: block;
		border-right: 3px solid var(--text);
	}

	.right {
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
	}

	.title {
		padding: 0.5rem;
	}

	.description {
		min-height: 0;
		flex: 1;
		overflow: hidden;
	}
</style>