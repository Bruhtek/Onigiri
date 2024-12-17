<script lang="ts">
	import Releases from '$lib/api/Releases.svelte';
	import GridLayout from '$lib/components/Layouts/GridLayout.svelte';
	import GridPage from '$lib/components/Layouts/GridPage.svelte';
	import StarFill from '~icons/ph/star-fill';
	import Star from '~icons/ph/star';
	import IconCheckbox from '$lib/components/Inputs/IconCheckbox.svelte';
	import JAccount from '$lib/api/JAccount.svelte';
	import PrefReleases from '$lib/stores/preferences/Releases.svelte';

	if (Releases.releases.length == 0) {
		Releases.fetchMoreReleases();
	}
</script>

<GridPage type="RELEASES">
	{#snippet leftPanel()}
		{#if JAccount.loggedIn && PrefReleases.v.favoritesOnly}
			Releases (Only followed)
		{:else}
			Releases
		{/if}
	{/snippet}
	{#snippet rightPanel()}
		{#if JAccount.loggedIn}
			<IconCheckbox
				current={PrefReleases.v.favoritesOnly}
				onChange={PrefReleases.changeFavoritesOnly}
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