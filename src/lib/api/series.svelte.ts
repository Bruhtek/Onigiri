import { createArrayStore, createStore } from '$lib/helpers/store.svelte';
import Serie, { SerieSchema } from '$lib/types/Serie';
import { z } from 'zod';
import { PaginationScheme } from '$lib/api/schemas';
import { jfetch } from '$lib/api/jnovel.old.svelte.js';
import notificationStore from '$lib/stores/notificationStore.svelte';

const seriesStore = createArrayStore<Serie>([]);

type SeriesPageProperties = {
	loading: boolean;
};

export const seriesPageProperties = createStore<SeriesPageProperties>({
	loading: false,
});

// #region Fetch series
const SeriesScheme = z.object({
	series: z.array(SerieSchema),
	pagination: PaginationScheme,
});
export const fetchSeries = async () => {
	if (seriesPageProperties.value.loading) {
		return;
	}

	seriesPageProperties.patch({ loading: true });

	try {
		const res = await jfetch('/series?limit=10000', {
			method: 'POST',
			body: JSON.stringify({
				type: 1,
			}),
		});
		const json = await res.json();
		const data = SeriesScheme.parse(json);

		const series = data.series.map((s) => new Serie(s));

		seriesStore.set(series);

		notificationStore.success('Loaded series');
	} catch (e) {
		console.log(e);
		if (e instanceof TypeError) {
			notificationStore.error('Failed to load series - no internet!');
		} else {
			notificationStore.error(`Failed to load series: ${e}`);
		}
	} finally {
		seriesPageProperties.patch({ loading: false });
	}
};

export default seriesStore;
