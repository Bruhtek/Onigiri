import Part from '$lib/types/Part';
import { createStore } from '$lib/helpers/store.svelte';
import { jfetch } from '$lib/api/jnovel.svelte';
import { z } from 'zod';
import notificationStore from '$lib/stores/notificationStore.svelte';

type ReleasesPageProperties = {
	page: number;
	partsPerPage: number;
};

const releasesStore = createStore<Part[]>([]);
export const releasesPageProperties = createStore<ReleasesPageProperties>({
	page: 0,
	partsPerPage: 0
});

const ReleasesScheme = z.object({
	parts: z.array(z.unknown())
});
export const fetchMoreReleases = async (limit: number = 200) => {
	const currentNum = releasesStore.value.length;
	const query = `?limit=${limit}&skip=${currentNum}`;

	try {
		const res = await jfetch(`/releases${query}`);
		const json = await res.json();
		const data = ReleasesScheme.parse(json);

		const newParts = data.parts.map((part: unknown) => new Part(part));

		releasesStore.update((parts) => [...parts, ...newParts]);

		notificationStore.notify(`Loaded ${limit} more releases`);
	} catch (e) {
		console.log(e);
		notificationStore.notify(`Error loading more releases: ${e}`);
	}
};

export default releasesStore;
