import Part, { PartScheme } from '$lib/types/Part';
import { createArrayStore } from '$lib/helpers/store.svelte';
import { jfetch } from '$lib/api/jnovel.old.svelte.js';
import { z } from 'zod';
import notificationStore from '$lib/stores/notificationStore.svelte';
import { PaginationScheme } from '$lib/api/schemas';
import releasesPreferencesStore from '$lib/stores/releasesPreferencesStore.svelte';
import { pageProperties } from '$lib/stores/pageProperties.svelte';
import JAccount from '$lib/api/JAccount.svelte';

const releasesStore = createArrayStore<Part>([]);

// #region Fetch releases
const ReleasesScheme = z.object({
	parts: z.array(PartScheme),
	pagination: PaginationScheme,
});
export const fetchMoreReleases = async (limit: number = 200) => {
	if (pageProperties.value.lastPage || pageProperties.value.loading) {
		return;
	}

	pageProperties.patch({ loading: true });
	const currentNum = releasesStore.value.length;
	let query = `?limit=${limit}&skip=${currentNum}&type=1`; // type 1 - only Novels
	if (JAccount.loggedIn && releasesPreferencesStore.value.favoritesOnly) {
		query += '&only_follows=true';
	}

	try {
		const res = await jfetch(`/releases${query}`);
		const json = await res.json();
		console.log(json);
		const data = ReleasesScheme.parse(json);

		const newParts = data.parts.map((part) => new Part(part));

		releasesStore.update((parts) => [...parts, ...newParts]);

		if (data.pagination.lastPage) {
			notificationStore.info('You have reached the last page');
			pageProperties.patch({ lastPage: true });
		}

		notificationStore.success(`Loaded ${limit} more releases`, 2000);
	} catch (e) {
		console.log(e);
		if (e instanceof TypeError) {
			notificationStore.error('Error loading more releases: no internet!');
		} else {
			notificationStore.error(`Error loading more releases: ${e}`);
		}
	} finally {
		pageProperties.patch({ loading: false });
	}
};

export const updateReleaseProgress = (id: string, progress: number) => {
	const index = releasesStore.value.findIndex((v) => v.id === id);
	if (index === -1) {
		return;
	}
	const part = releasesStore.value[index];
	part.progress = progress;

	releasesStore.patchAtIndex(part, index);
};

export default releasesStore;
