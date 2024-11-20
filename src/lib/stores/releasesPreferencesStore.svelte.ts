import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';
import releasesStore, { fetchMoreReleases, releasesPageProperties } from '$lib/api/releases.svelte';

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
	if (releasesPageProperties.value.loading) {
		return;
	}

	await releasesPreferencesStore.patch({ favoritesOnly: state });

	releasesPageProperties.patch({ loading: true });
	releasesStore.reset();

	releasesPageProperties.patch({ loading: false });
	await fetchMoreReleases();
};

export default releasesPreferencesStore;
