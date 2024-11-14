import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';

type ReaderPreferencesData = {
	pageMargins: number;
	fontSize: number;
};

const readerPreferencesStore = await createPersistentStore<ReaderPreferencesData>(
	'readerPreferences',
	{
		pageMargins: 12,
		fontSize: 18,
	},
);

export default readerPreferencesStore;
