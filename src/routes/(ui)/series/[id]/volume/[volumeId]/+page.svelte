<script lang="ts">
	import type { PageData } from './$types';
	import Series from '$lib/api/Series.svelte';
	import { toProperCase } from '$lib/helpers/utils';
	import CenteredLayout from '$lib/components/Layouts/CenteredLayout.svelte';
	import Reader from '$lib/components/Reader/Reader.svelte';
	import GridPage from '$lib/components/Layouts/GridPage.svelte';
	import GridLayout from '$lib/components/Layouts/GridLayout.svelte';
	import previousUrl from '$lib/stores/previousUrl.svelte';
	import { goto } from '$app/navigation';
	import ArrowLeft from '~icons/ph/arrow-left';
	import TabsLayout from '$lib/components/Layouts/TabsLayout.svelte';

	let { data }: { data: PageData } = $props();

	let volume = $derived(Series.current?.volumes.find(v => v.volume.id == data.volumeId));

	const onBack = () => {
		if (previousUrl.value.includes(window.location.host)) {
			history.back();
		} else {
			goto(`/series/${data.seriesId}`);
		}
	};
</script>

{#snippet seriesInfoSnippet()}
	{#if !volume}
		<CenteredLayout>
			<div>Loading...</div>
		</CenteredLayout>
	{:else}
		<div class="volumeInfo">
			<img class="cover-url" src={volume.volume.coverURL} alt={Series.current.title} />
			{#each Object.entries(volume.volume.creators).sort() as [key, value]}
				<div class="creators">
					<span class="key">{toProperCase(key) + (value.length > 1 ? "s:" : ":")}</span>
					<span class="value">
						{value.join(", ")}
					</span>
				</div>
			{/each}
		</div>
	{/if}
{/snippet}
{#snippet descriptionSnippet()}
	{#if !volume}
		<CenteredLayout>
			<div>Loading...</div>
		</CenteredLayout>
	{:else}
		<Reader
			minimal={true}
			content={volume.volume.description}
			toggleZones={() => {}}
			partTocResult={{ error: "" }}
			loading={false}
			id={volume.volume.id}
		/>
	{/if}
{/snippet}
{#snippet partSnippet()}
	{#if volume}
		<GridPage type="VOLUMES" showTotalPages={true}>
			<GridLayout items={volume.parts.map((p) => {
				p.title = p.getFullIndexes();
				return p;
			})} />
		</GridPage>
	{:else}
		<CenteredLayout>
			<div>Loading...</div>
		</CenteredLayout>
	{/if}
{/snippet}


<div class="top-bar">
	<button class="button" onclick={onBack}>
		<ArrowLeft width="32px" height="32px" />
		Back
	</button>
	<div>
		{#if volume}
			<h2>{volume.volume.title}</h2>
		{/if}
	</div>
</div>

<TabsLayout tabLabels={["Details", "Description", "Parts"]}
			tabs={[seriesInfoSnippet, descriptionSnippet, partSnippet]} />


<style>
	.top-bar {
		width: 100%;
		padding: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		text-align: right;
		gap: 0.5rem;
	}

	.cover-url {
		align-self: center;
		flex-grow: 1;
		min-height: 0;
		display: block;
		border: 3px solid var(--text);
	}

	.creators {
		font-size: 1.1em;
		display: flex;
		padding: 0 0.5rem;
		gap: 0.5rem;
	}

	.creators .key {
		font-weight: bold;
	}

	.creators:first-of-type {
		margin-top: 1rem;
	}

	.creators:last-child {
		margin-bottom: 1rem;
	}

	.volumeInfo {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
</style>