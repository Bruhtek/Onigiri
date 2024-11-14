import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';

type PreferencesData = {
	verticalTabsWhileHorizontal: boolean;
	releasesDisplayType: 'grid' | 'list' | 'thumbnailList';
	columnCountVertical: number;
	columnCountHorizontal: number;
	gridObjectGap: number;
};

const preferencesStore = await createPersistentStore<PreferencesData>('preferences', {
	verticalTabsWhileHorizontal: true,
	releasesDisplayType: 'grid',
	columnCountVertical: 3,
	columnCountHorizontal: 6,
	gridObjectGap: 16,
});

export default preferencesStore;
