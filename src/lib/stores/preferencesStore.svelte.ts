import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';

type PreferencesData = {
	verticalTabsWhileHorizontal: boolean;
	releasesDisplayType: 'grid' | 'list' | 'thumbnailList';
	columnCountVertical: number;
	columnCountHorizontal: number;
	gridObjectGap: number;
	darkMode: boolean;
};

export const defaultPreferencesData: PreferencesData = {
	verticalTabsWhileHorizontal: true,
	releasesDisplayType: 'grid',
	columnCountVertical: 4,
	columnCountHorizontal: 6,
	gridObjectGap: 16,
	darkMode: false,
};
const preferencesStore = await createPersistentStore<PreferencesData>(
	'preferences',
	defaultPreferencesData,
);

export default preferencesStore;
