import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';

export type SeriesPagePreferences = {
	favoritesOnly: boolean;
	catchupOnly: boolean;
	query: string;
};
export const seriesPagePreferences = await createPersistentStore<SeriesPagePreferences>(
	'seriesPagePreferences',
	{
		favoritesOnly: false,
		catchupOnly: false,
		query: '',
	},
);
