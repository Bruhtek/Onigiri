import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';
import releasesStore, { fetchMoreReleases } from '$lib/api/releases.svelte';
import { pageProperties } from '$lib/stores/pageProperties.svelte';

type ReleasesPreferencesData = {
	favoritesOnly: boolean;
};

const releasesPreferencesStore = await createPersistentStore<ReleasesPreferencesData>(
	'releasePreferences',
	{
		favoritesOnly: false,
	},
);

export const changeFavoritesOnly = async (state: boolean) => {
	if (pageProperties.value.loading) {
		return;
	}

	await releasesPreferencesStore.patch({ favoritesOnly: state });

	pageProperties.patch({ loading: true });
	releasesStore.reset();

	pageProperties.patch({ loading: false });
	await fetchMoreReleases();
};

export default releasesPreferencesStore;
