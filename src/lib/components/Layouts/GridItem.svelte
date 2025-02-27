<script lang="ts">
	import type { LayoutItemProp } from '$lib/types/LayoutItem';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import longPress from '$lib/helpers/useLongPress.svelte';
	import PrefDisplay from '$lib/stores/preferences/Display.svelte';

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

	let href = $derived.by(() => {
		if(typeof actualItem.href === 'function') {
			return actualItem.href($page.url.pathname);
		} else {
			return actualItem.href;
		}
	})
</script>

<a class="item"
   class:disabled={actualItem.disabled}
   href={actualItem.disabled ? "#" : href}
   onclick={() => {}}
   ontouchstart={() => {}}
   use:longPress={() => actualItem.longPressHref && goto(actualItem.longPressHref)}
>
	<div class="image">
		{#if !PrefDisplay.v.hdThumbnails}
			{#key actualItem.imageSrc}
				<img class="image-obj" src={actualItem.imageSrc} alt={actualItem.title} />
			{/key}
		{:else}
			{#key actualItem.HDImageSrc || actualItem.imageSrc}
				<img class="image-obj" src={actualItem.HDImageSrc || actualItem.imageSrc} alt={actualItem.title} />
			{/key}
		{/if}
	</div>
	<div class="title" style="--progress: {actualItem.progress || 0}">
		<div class="title-bg"></div>
		<p class="title-p">
			{#if actualItem.titleWithoutIndexes}
				{actualItem.titleWithoutIndexes()}
			{:else}
				{actualItem.title}
			{/if}
		</p>
	</div>
	<!-- Dont have a good name for this, its basically Part 8, Volume 3, etc. -->
	{#if actualItem.indexes}
		<div class="indexes-badge">
			{actualItem.indexes()}
		</div>
	{/if}
</a>

<style>
	.item {
		background-color: var(--bg);
		color: var(--text);
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 100%;
		aspect-ratio: var(--column-aspect-ratio);
		position: relative;
		border: 3px solid var(--text);
		border-color: var(--text);
		user-select: none;
	}
	.item:hover:active {
		background-color: var(--text);
		color: var(--bg);
	}
	.item.disabled {
		opacity: 0.5;
		pointer-events: none;
	}

	.image {
		width: 100%;
		height: 100%;
		overflow: hidden;

		.image-obj {
			width: 100%;
			height: 100%;
			object-fit: cover;
			overflow: hidden;
		}
	}

	.title {
		position: absolute;
		display: grid;
		align-items: center;
		bottom: 0;
		left: 0;
		width: 100%;
		color: inherit;
		background-color: inherit;
		border-top-width: 3px;
		border-top-style: solid;
		border-color: inherit;
		box-sizing: content-box;
		height: calc(2lh + 0.4rem);

		.title-p {
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
			text-align: center;
			overflow: hidden;
			margin: 0.3rem;
			mix-blend-mode: difference;
			z-index: 10;
			color: white;
		}

		.title-bg {
			position: absolute;
			height: 100%;
			width: calc(var(--progress) * 100%);
			background-color: var(--text);
			left: 0;
			top: 0;
		}
	}


	.indexes-badge {
		position: absolute;
		top: 0.2rem;
		left: 0.2rem;
		padding: 0.2em;
		border-color: inherit;
		border-width: 3px;
		border-style: solid;
		background-color: inherit;
	}
</style>