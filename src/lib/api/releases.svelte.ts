import Part, { PartScheme } from '$lib/types/Part';
import { createArrayStore, createStore } from '$lib/helpers/store.svelte';
import { jfetch } from '$lib/api/jnovel.svelte';
import { z } from 'zod';
import notificationStore from '$lib/stores/notificationStore.svelte';
import { PaginationScheme } from '$lib/api/schemas';
import releasesPreferencesStore from '$lib/stores/releasesPreferencesStore.svelte';
import { loggedIn } from '$lib/api/account.svelte';

type ReleasesPageProperties = {
	page: number;
	partsPerPage: number;
	itemsPerPage: number;
	itemsCount: number;
	loading: boolean;
	lastPage: boolean;
};

const releasesStore = createArrayStore<Part>([]);

export const releasesPageProperties = createStore<ReleasesPageProperties>({
	page: 0,
	partsPerPage: 0,
	itemsPerPage: -1,
	itemsCount: 0,
	loading: false,
	lastPage: false,
});

export const changeReleasesPage = (direction: number) => {
	releasesPageProperties.update((v) => {
		let page: number;
		if (direction < 0) {
			page = Math.max(0, v.page - 1);
			page = Math.min(Math.ceil(v.itemsCount / v.itemsPerPage) - 1, page);
		} else {
			page = Math.max(0, v.page + 1);
			page = Math.min(Math.ceil(v.itemsCount / v.itemsPerPage) - 1, page);
		}

		return { ...v, page };
	});
};

// #region Fetch releases
const ReleasesScheme = z.object({
	parts: z.array(PartScheme),
	pagination: PaginationScheme,
});
export const fetchMoreReleases = async (limit: number = 200) => {
	if (releasesPageProperties.value.lastPage || releasesPageProperties.value.loading) {
		return;
	}

	releasesPageProperties.patch({ loading: true });
	const currentNum = releasesStore.value.length;
	let query = `?limit=${limit}&skip=${currentNum}&type=1`; // type 1 - only Novels
	if (loggedIn() && releasesPreferencesStore.value.favoritesOnly) {
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
			releasesPageProperties.patch({ lastPage: true });
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
		releasesPageProperties.patch({ loading: false });
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
