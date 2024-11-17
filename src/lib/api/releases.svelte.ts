import Part, { PartScheme } from '$lib/types/Part';
import { createArrayStore, createStore } from '$lib/helpers/store.svelte';
import { jfetch } from '$lib/api/jnovel.svelte';
import { z } from 'zod';
import notificationStore from '$lib/stores/notificationStore.svelte';

type ReleasesPageProperties = {
	page: number;
	partsPerPage: number;
	itemsPerPage: number;
	itemsCount: number;
};

const releasesStore = createArrayStore<Part>([]);

export const releasesPageProperties = createStore<ReleasesPageProperties>({
	page: 0,
	partsPerPage: 0,
	itemsPerPage: -1,
	itemsCount: 0,
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
});
export const fetchMoreReleases = async (limit: number = 200) => {
	const currentNum = releasesStore.value.length;
	const query = `?limit=${limit}&skip=${currentNum}&type=1`; // type 1 - only Novels

	try {
		const res = await jfetch(`/releases${query}`);
		const json = await res.json();
		console.log(json);
		const data = ReleasesScheme.parse(json);

		const newParts = data.parts.map((part) => new Part(part));

		releasesStore.update((parts) => [...parts, ...newParts]);

		notificationStore.success(`Loaded ${limit} more releases`);
	} catch (e) {
		console.log(e);
		notificationStore.error(`Error loading more releases: ${e}`);
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
