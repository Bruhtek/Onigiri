import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';

type PreferencesData = {
	verticalTabsWhileHorizontal: boolean;
	releasesDisplayType: 'grid' | 'list' | 'thumbnailList';
	columnCountVertical: number;
	columnCountHorizontal: number;
};

const preferencesStore = await createPersistentStore<PreferencesData>('preferences', {
	verticalTabsWhileHorizontal: true,
	releasesDisplayType: 'grid',
	columnCountVertical: 5,
	columnCountHorizontal: 6
});

export default preferencesStore;
