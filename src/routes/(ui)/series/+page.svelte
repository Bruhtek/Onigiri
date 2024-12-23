<script lang="ts">
	import GridLayout from '$lib/components/Layouts/GridLayout.svelte';
	import GridPage from '$lib/components/Layouts/GridPage.svelte';
	import Star from '~icons/ph/star';
	import StarFill from '~icons/ph/star-fill';
	import Timer from '~icons/ph/timer';
	import TimerFill from '~icons/ph/timer-fill';
	import MagnifyingGlass from '~icons/ph/magnifying-glass';
	import IconCheckbox from '$lib/components/Inputs/IconCheckbox.svelte';

	import Dialog from '$lib/stores/Dialog.js';
	import JAccount from '$lib/api/JAccount.svelte';
	import Series from '$lib/api/Series.svelte';
	import PrefSeries from '$lib/stores/preferences/Series.svelte';
	import { DisplayType } from '$lib/stores/preferences/Display.svelte';

	if (Series.series.length == 0) {
		Series.fetchSeries();
	}

	let createQueryDialog = () => {
		const callback = (q: string) => {
			PrefSeries.patch({ query: q });
		};

		Dialog.requestDialog({
			title: 'Search',
			type: 'string',
			description: 'Enter a search query',
			hotReload: true,
			currentValue: PrefSeries.v.query,
			callback,
		});
	};

	let filteredSeries = $derived.by(() => {
		let series = Series.series;
		if (!PrefSeries.v.favoritesOnly && !PrefSeries.v.catchupOnly && !PrefSeries.v.query) {
			return series;
		}

		return series.filter((s) => {
			if (JAccount.loggedIn && PrefSeries.v.favoritesOnly && !s.following) {
				return false;
			}
			if (PrefSeries.v.catchupOnly && !s.catchup) {
				return false;
			}
			return !(PrefSeries.v.query && !s.title.toLowerCase().includes(PrefSeries.v.query.toLowerCase()));
		});
	});
</script>

<GridPage
	type="SERIES"
	showTotalPages={true}
	currentDisplay={DisplayType.Grid}
>
	{#snippet leftPanel()}
		Series
		{#if ((JAccount.loggedIn && PrefSeries.v.favoritesOnly)
			|| PrefSeries.v.catchupOnly
			|| PrefSeries.v.query)
		}
			(Filtered)
		{/if}
	{/snippet}
	{#snippet rightPanel()}
		<button class="search" onclick={createQueryDialog}>
			<span class="query">
				{#if PrefSeries.v.query}
					{PrefSeries.v.query}
				{/if}
			</span>
			<MagnifyingGlass width="32px" height="32px" />
		</button>
		<IconCheckbox
			current={PrefSeries.v.catchupOnly}
			onChange={() => PrefSeries.patch({catchupOnly: !PrefSeries.v.catchupOnly})}
		>
			{#snippet stateOn()}
				<TimerFill width="32px" height="32px" />
			{/snippet}
			{#snippet stateOff()}
				<Timer width="32px" height="32px" />
			{/snippet}
		</IconCheckbox>
		{#if JAccount.loggedIn}
			<IconCheckbox
				current={PrefSeries.v.favoritesOnly}
				onChange={() => PrefSeries.patch({favoritesOnly: !PrefSeries.v.favoritesOnly})}
			>
				{#snippet stateOn()}
					<StarFill width="32px" height="32px" />
				{/snippet}
				{#snippet stateOff()}
					<Star width="32px" height="32px" />
				{/snippet}
			</IconCheckbox>
		{/if}
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