<script lang="ts">
	import releasesStore, { fetchMoreReleases } from '$lib/api/releases.svelte';
	import GridLayout from '$lib/components/Layouts/GridLayout.svelte';
	import GridPage from '$lib/components/Layouts/GridPage.svelte';
	import { loggedIn } from '$lib/api/account.svelte';
	import releasesPreferencesStore, { changeFavoritesOnly } from '$lib/stores/releasesPreferencesStore.svelte';
	import StarFill from '~icons/ph/star-fill';
	import Star from '~icons/ph/star';
	import IconCheckbox from '$lib/components/Inputs/IconCheckbox.svelte';

	if (releasesStore.value.length == 0) {
		fetchMoreReleases();
	}
</script>

<GridPage type="RELEASES">
	{#snippet leftPanel()}
		{#if loggedIn() && releasesPreferencesStore.value.favoritesOnly}
			Releases (Only followed)
		{:else}
			Releases
		{/if}
	{/snippet}
	{#snippet rightPanel()}
		{#if loggedIn()}
			<IconCheckbox
				current={releasesPreferencesStore.value.favoritesOnly}
				onChange={changeFavoritesOnly}
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
	<GridLayout items={releasesStore.value} />
</GridPage>