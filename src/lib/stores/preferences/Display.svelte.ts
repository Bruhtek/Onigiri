import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';
import PreferenceClass from '$lib/stores/preferences/_PreferenceClass';

export const displayType = ['grid', 'list', 'thumbnailList'] as const;
type DisplayType = (typeof displayType)[number];

export type DisplayPreferences = {
	releasesDisplayType: DisplayType;
	gridColumnCountVertical: number;
	gridColumnCountHorizontal: number;
	gridObjectGap: number;
};
export const displayPreferencesDefaults: DisplayPreferences = {
	releasesDisplayType: 'grid',
	gridColumnCountVertical: 4,
	gridColumnCountHorizontal: 6,
	gridObjectGap: 16,
};

const prefDisplay = await createPersistentStore<DisplayPreferences>(
	'pref-display',
	displayPreferencesDefaults,
);

const PrefDisplay = new PreferenceClass(prefDisplay);

export default PrefDisplay;
