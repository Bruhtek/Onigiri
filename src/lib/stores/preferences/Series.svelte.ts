import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';
import PreferenceClass from '$lib/stores/preferences/_PreferenceClass';

export type SeriesPreferencesType = {
	favoritesOnly: boolean;
	catchupOnly: boolean;
	query: string;
};

export const prefSeries = await createPersistentStore<SeriesPreferencesType>('pref-series', {
	favoritesOnly: false,
	catchupOnly: false,
	query: '',
});

const PrefSeries = new PreferenceClass<SeriesPreferencesType>(prefSeries);
export default PrefSeries;
