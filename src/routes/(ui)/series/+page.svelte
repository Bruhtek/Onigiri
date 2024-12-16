<script lang="ts">
	import GridLayout from '$lib/components/Layouts/GridLayout.svelte';
	import GridPage from '$lib/components/Layouts/GridPage.svelte';
	import Star from '~icons/ph/star';
	import StarFill from '~icons/ph/star-fill';
	import Timer from '~icons/ph/timer';
	import TimerFill from '~icons/ph/timer-fill';
	import MagnifyingGlass from '~icons/ph/magnifying-glass';
	import IconCheckbox from '$lib/components/Inputs/IconCheckbox.svelte';

	import { seriesPagePreferences } from '$lib/stores/seriesPagePreferences.svelte';
	import requestDialog from '$lib/stores/dialogStore.svelte';
	import JAccount from '$lib/api/JAccount.svelte';
	import Series from '$lib/api/Series.svelte';

	if (Series.series.length == 0) {
		Series.fetchSeries();
	}

	let createQueryDialog = () => {
		const callback = (q: string) => {
			seriesPagePreferences.patch({ query: q });
		};

		requestDialog({
			title: 'Search',
			type: 'string',
			description: 'Enter a search query',
			hotReload: true,
			currentValue: seriesPagePreferences.value.query,
			callback,
		});
	};

	let filteredSeries = $derived.by(() => {
		let series = Series.series;
		if (!seriesPagePreferences.value.favoritesOnly && !seriesPagePreferences.value.catchupOnly && !seriesPagePreferences.value.query) {
			return series;
		}

		return series.filter((s) => {
			if (seriesPagePreferences.value.favoritesOnly && !s.following) {
				return false;
			}
			if (seriesPagePreferences.value.catchupOnly && !s.catchup) {
				return false;
			}
			return !(seriesPagePreferences.value.query && !s.title.toLowerCase().includes(seriesPagePreferences.value.query.toLowerCase()));
		});
	});
</script>

<GridPage type="SERIES">
	{#snippet leftPanel()}
		Series
		{#if JAccount.loggedIn && (
			seriesPagePreferences.value.favoritesOnly
			|| seriesPagePreferences.value.catchupOnly
			|| seriesPagePreferences.value.query)
		}
			(Filtered)
		{/if}
	{/snippet}
	{#snippet rightPanel()}
		<button class="search" onclick={createQueryDialog}>
			<span class="query">
				{#if seriesPagePreferences.value.query}
					{seriesPagePreferences.value.query}
				{/if}
			</span>
			<MagnifyingGlass width="32px" height="32px" />
		</button>
		<IconCheckbox
			current={seriesPagePreferences.value.catchupOnly}
			onChange={() => seriesPagePreferences.patch({catchupOnly: !seriesPagePreferences.value.catchupOnly})}
		>
			{#snippet stateOn()}
				<TimerFill width="32px" height="32px" />
			{/snippet}
			{#snippet stateOff()}
				<Timer width="32px" height="32px" />
			{/snippet}
		</IconCheckbox>
		<IconCheckbox
			current={seriesPagePreferences.value.favoritesOnly}
			onChange={() => seriesPagePreferences.patch({favoritesOnly: !seriesPagePreferences.value.favoritesOnly})}
		>
			{#snippet stateOn()}
				<StarFill width="32px" height="32px" />
			{/snippet}
			{#snippet stateOff()}
				<Star width="32px" height="32px" />
			{/snippet}
		</IconCheckbox>
	{/snippet}
	<GridLayout items={filteredSeries} />
</GridPage>

<style>
	.search {
		cursor: pointer;
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
	}

	.search .query:after {
		content: '';
		display: block;
		width: 100%;
		height: 3px;
		background-color: var(--text);
	}
</style>