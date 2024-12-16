import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';
import Releases from '$lib/api/Releases.svelte';

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
	if (Releases.loading) {
		return;
	}

	await releasesPreferencesStore.patch({ favoritesOnly: state });

	Releases.loading = true;
	Releases.clear();
	Releases.loading = false;
	await Releases.fetchMoreReleases();
};

export default releasesPreferencesStore;
