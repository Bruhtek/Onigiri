<script lang="ts">
	import ArrowLeft from '~icons/ph/arrow-left';
	import { goto } from '$app/navigation';
	import { isPartTocResult, type PartTocResult } from '$lib/api/parts.svelte';

	interface Props {
		partTocResult: PartTocResult | { error: string };
	}

	const props: Props = $props();

	const goBack = () => {
		// if the user navigated from outside, for example from a bookmark, redirect him to the main page
		if (document.referrer.includes(window.location.host)) {
			history.back();
		} else {
			goto('/');
		}
	};
</script>

{#if !isPartTocResult(props.partTocResult)}
	<div class="top">
		<div class="left">
			<button type="button"
					class="button"
					onclick={goBack}
			>
				<ArrowLeft />
				Back
			</button>
		</div>
		<div class="right">
			{props.partTocResult.error}
		</div>
	</div>
{:else}
	<div class="top">
		<div class="left">
			<button type="button"
					class="button"
					onclick={goBack}
			>
				<ArrowLeft />
				Back
			</button>
		</div>
		<div class="right">
			{props.partTocResult.currentPart.getFullIndexes()}
		</div>
	</div>
	<div class="partTitle">
		{props.partTocResult.seriesTitle}
	</div>
	<div class="navigation">
		<div class="left">
			{#if props.partTocResult.previousPart}
				<a class="button" href="/reader/{props.partTocResult.previousPart.id}">
					Previous Part
				</a>
			{/if}
		</div>
		<div class="right">
			{#if props.partTocResult.nextPart}
				<a class="button" href="/reader/{props.partTocResult.nextPart.id}">
					Next Part
				</a>
			{/if}
		</div>
	</div>
{/if}

<style>
	.top {
		display: flex;
		justify-content: space-between;
	}

	.top .right {
		display: flex;
		place-content: center;
		place-items: center;
	}

	.partTitle {
		text-align: center;
	}

	.navigation {
		display: flex;
		justify-content: space-between;
	}
</style>