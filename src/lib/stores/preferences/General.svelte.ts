import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';
import PreferenceClass from '$lib/stores/preferences/_PreferenceClass';

export type GeneralPreferences = {
	verticalTabsWhileHorizontal: boolean;
	darkMode: boolean;
};

export const generalPreferencesDefaults: GeneralPreferences = {
	verticalTabsWhileHorizontal: true,
	darkMode: false,
};

export const prefGeneral = await createPersistentStore<GeneralPreferences>(
	'pref-general',
	generalPreferencesDefaults,
);

const PrefGeneral = new PreferenceClass(prefGeneral);
export default PrefGeneral;
