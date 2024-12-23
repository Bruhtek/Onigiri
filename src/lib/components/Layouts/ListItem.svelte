<script lang="ts">
	import type { LayoutItemProp } from '$lib/types/LayoutItem';
	import PrefDisplay from '$lib/stores/preferences/Display.svelte';
	import Reader from '$lib/components/Reader/Reader.svelte';
	import PrefReader from '$lib/stores/preferences/Reader.svelte';
	import ListSubItems from '$lib/components/Layouts/ListSubItems.svelte';
	import { page } from '$app/stores';

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

	let href = $derived.by(() => {
		if (typeof actualItem.href === 'string') {
			return actualItem.href;
		}
		return actualItem.href($page.url.pathname);
	});
</script>

{#snippet ItemImage(secondary: boolean)}
	{#if !PrefDisplay.v.hdThumbnails}
		{#key actualItem.imageSrc}
			<img class="image-obj" class:secondary={secondary} src={actualItem.imageSrc} alt={actualItem.title} />
		{/key}
	{:else}
		{#key actualItem.HDImageSrc || actualItem.imageSrc}
			<img class="image-obj" class:secondary={secondary} src={actualItem.HDImageSrc || actualItem.imageSrc}
				 alt={actualItem.title} />
		{/key}
	{/if}
{/snippet}

<div class="item"
	 class:disabled={actualItem.disabled}
>
	{@render ItemImage(false)}
	<div class="right">
		<div class="header">
			<h3 class="title">
				{#if actualItem.titleWithoutIndexes}
					{actualItem.titleWithoutIndexes()}
				{:else}
					{actualItem.title}
				{/if}
			</h3>
			<a class="button" href={href}>
				Details
			</a>
		</div>
		<div class="secondary-image">
			{@render ItemImage(true)}
		</div>
		{#if actualItem.description}
			{#key actualItem.title}
				<div class="description">
					<Reader
						minimal={true}
						miniMargins={true}
						content={"<p>" + actualItem.description + "</p>"}
						toggleZones={() => {}}
						partTocResult={{ error: "" }}
						loading={false}
						id={Math.random().toString(16)}
						overrideFontSize={Math.floor(PrefReader.v.fontSize * 0.9)}
					/>
				</div>
			{/key}
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
		container-type: size;
		aspect-ratio: auto;
	}

	.secondary-image {
		display: none;
		min-height: 0;
		flex: 1;
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

	.header {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.description {
		display: none;
		min-height: 0;
		flex: 1;
		padding: 0 0.3rem;
		overflow: hidden;
	}

	.button {
		margin: 0.5rem;
	}

	@container (max-aspect-ratio: 1/1) {
		img.image-obj:not(.secondary) {
			display: none;
		}

		.secondary-image {
			display: flex;
			height: 100%;
			padding: 0.5rem;
		}

		img.secondary {
			margin: auto;
			border: 3px solid var(--text);
		}
	}

	@container (min-aspect-ratio: 2/1) or (min-height: 260px) {
		.description {
			display: block;
		}
	}

	@container (max-height: 150px) {
		.description {
			display: none;
		}
	}

	@container (max-height: 250px) and (max-aspect-ratio: 3/1) {
		.description {
			display: none;
		}
	}
</style>