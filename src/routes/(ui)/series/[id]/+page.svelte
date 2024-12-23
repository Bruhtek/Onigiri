<script lang="ts">
	import Series from '$lib/api/Series.svelte';
	import ArrowLeft from '~icons/ph/arrow-left';
	import CenteredLayout from '$lib/components/Layouts/CenteredLayout.svelte';
	import GridLayout from '$lib/components/Layouts/GridLayout.svelte';
	import { goto } from '$app/navigation';
	import GridPage from '$lib/components/Layouts/GridPage.svelte';
	import previousUrl from '$lib/stores/previousUrl.svelte';
	import TabsLayout from '$lib/components/Layouts/TabsLayout.svelte';
	import Reader from '$lib/components/Reader/Reader.svelte';
	import { toProperCase } from '$lib/helpers/utils';

	const onBack = () => {
		if (previousUrl.value.includes(window.location.host)) {
			history.back();
		} else {
			goto('/series');
		}
	};
</script>

{#snippet seriesInfoSnippet()}
	{#if !Series.current}
		<CenteredLayout>
			<div>Loading...</div>
		</CenteredLayout>
	{:else}
		<div class="seriesInfo">
			<img class="cover-url" src={Series.current.coverURL} alt={Series.current.title} />
			{#each Object.entries(Series.current.creators).sort() as [key, value]}
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
	{#if !Series.current}
		<CenteredLayout>
			<div>Loading...</div>
		</CenteredLayout>
	{:else}
		<Reader
			minimal={true}
			content={Series.current.description}
			toggleZones={() => {}}
			partTocResult={{ error: "" }}
			loading={false}
			id={Series.current.id}
		/>
	{/if}
{/snippet}
{#snippet volumesSnippet()}
	{#if Series.current}
		<GridPage type="VOLUMES" showTotalPages={true}>
			<GridLayout items={Series.current.volumes.map(item => item.volume)} />
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
		{#if Series.current}
			<h2>{Series.current.title}</h2>
		{/if}
	</div>
</div>

<TabsLayout tabLabels={["Details", "Description", "Volumes"]}
			tabs={[seriesInfoSnippet, descriptionSnippet, volumesSnippet]} />


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

	.seriesInfo {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

</style>