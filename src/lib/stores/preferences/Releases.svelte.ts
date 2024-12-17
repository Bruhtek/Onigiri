import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';
import Releases from '$lib/api/Releases.svelte';
import PreferenceClass from '$lib/stores/preferences/_PreferenceClass';

type ReleasesPreferencesData = {
	favoritesOnly: boolean;
};
const prefReleases = await createPersistentStore<ReleasesPreferencesData>('pref-releases', {
	favoritesOnly: false,
});

class PrefReleasesManager extends PreferenceClass<ReleasesPreferencesData> {
	public changeFavoritesOnly = async (state: boolean) => {
		if (Releases.loading) {
			return;
		}

		await this.patch({ favoritesOnly: state });

		Releases.loading = true;
		Releases.clear();
		Releases.loading = false;
		await Releases.fetchMoreReleases();
	};
}

const PrefReleases = new PrefReleasesManager(prefReleases);
export default PrefReleases;
