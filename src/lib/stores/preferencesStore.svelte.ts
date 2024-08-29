import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';

type PreferencesData = {
	verticalTabsWhileHorizontal: boolean;
	releasesDisplayType: 'grid' | 'list' | 'thumbnailList';
};

const preferencesStore = await createPersistentStore<PreferencesData>('preferences', {
	verticalTabsWhileHorizontal: false,
	releasesDisplayType: 'grid'
});

export default preferencesStore;
