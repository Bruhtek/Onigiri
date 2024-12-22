<script lang="ts">
	import type { PageData } from './$types';
	import Series from '$lib/api/Series.svelte';
	import { onMount, untrack } from 'svelte';
	import ArrowLeft from '~icons/ph/arrow-left';
	import CenteredLayout from '$lib/components/Layouts/CenteredLayout.svelte';
	import GridLayout from '$lib/components/Layouts/GridLayout.svelte';
	import { goto } from '$app/navigation';
	import GridPage from '$lib/components/Layouts/GridPage.svelte';
	import DisplayPage from '$lib/stores/DisplayPage.svelte';
	import previousUrl from '$lib/stores/previousUrl.svelte';

	let { data }: { data: PageData } = $props();

	$effect(() => {
		const id = data.seriesId;
		untrack(() => {
			Series.fetchSeriesDetails(id);
		});
	});

	onMount(() => {
		DisplayPage.patch({
			currentDisplay: 'VOLUMES',
		});
	});

	const onBack = () => {
		if (previousUrl.value.includes(window.location.host)) {
			history.back();
		} else {
			goto('/series');
		}
	};
</script>

<div class="top-bar">
	<button class="button" onclick={onBack}>
		<ArrowLeft width="32px" height="32px" />
		Back
	</button>
	<!--{#if Series.current}-->

	<!--{/if}-->
</div>
{#if Series.current}
	<GridPage type="VOLUMES" showTotalPages={true}>
		<GridLayout items={Series.current.volumes.map(item => item.volume)} />
	</GridPage>
{:else}
	<CenteredLayout>
		<div>Loading...</div>
	</CenteredLayout>
{/if}


<style>
	.top-bar {
		width: 100%;
		padding: 0.5rem;
	}
</style>