import Part, { PartScheme } from '$lib/types/Part';
import { createStore } from '$lib/helpers/store.svelte';
import { jfetch } from '$lib/api/jnovel.svelte';
import { z } from 'zod';
import notificationStore from '$lib/stores/notificationStore.svelte';

type ReleasesPageProperties = {
	page: number;
	partsPerPage: number;
	itemsPerPage: number;
	itemsCount: number;
};

const releasesStore = createStore<Part[]>([]);

export const releasesPageProperties = createStore<ReleasesPageProperties>({
	page: 0,
	partsPerPage: 0,
	itemsPerPage: -1,
	itemsCount: 0,
});

export const changeReleasesPage = (direction: number) => {
	releasesPageProperties.update((v) => {
		let page = 0;
		if (direction < 0) {
			page = Math.max(0, v.page - 1);
		} else {
			page = Math.min(Math.ceil(v.itemsCount / v.itemsPerPage) - 1, v.page + 1);
		}

		return { ...v, page };
	});
};

const ReleasesScheme = z.object({
	parts: z.array(PartScheme),
});
export const fetchMoreReleases = async (limit: number = 200) => {
	const currentNum = releasesStore.value.length;
	const query = `?limit=${limit}&skip=${currentNum}`;

	try {
		const res = await jfetch(`/releases${query}`);
		const json = await res.json();
		console.log(json);
		const data = ReleasesScheme.parse(json);

		const newParts = data.parts.map((part) => new Part(part));

		releasesStore.update((parts) => [...parts, ...newParts]);

		notificationStore.notify(`Loaded ${limit} more releases`);
	} catch (e) {
		console.log(e);
		notificationStore.notify(`Error loading more releases: ${e}`);
	}
};

export default releasesStore;
