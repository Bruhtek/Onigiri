<script lang="ts">
	import Releases from '$lib/api/Releases.svelte.js';
	import GridLayout from '$lib/components/Layouts/GridLayout.svelte';
	import GridPage from '$lib/components/Layouts/GridPage.svelte';
	import releasesPreferencesStore, { changeFavoritesOnly } from '$lib/stores/releasesPreferencesStore.svelte';
	import StarFill from '~icons/ph/star-fill';
	import Star from '~icons/ph/star';
	import IconCheckbox from '$lib/components/Inputs/IconCheckbox.svelte';
	import JAccount from '$lib/api/JAccount.svelte';

	if (Releases.releases.length == 0) {
		Releases.fetchMoreReleases();
	}
</script>

<GridPage type="RELEASES">
	{#snippet leftPanel()}
		{#if JAccount.loggedIn && releasesPreferencesStore.value.favoritesOnly}
			Releases (Only followed)
		{:else}
			Releases
		{/if}
	{/snippet}
	{#snippet rightPanel()}
		{#if JAccount.loggedIn}
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
	<GridLayout items={Releases.releases} />
</GridPage>