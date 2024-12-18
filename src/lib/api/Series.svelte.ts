import { createArrayStore } from '$lib/helpers/store.svelte';
import Serie, { SerieSchema } from '$lib/types/Serie';
import { z } from 'zod';
import { PaginationScheme } from '$lib/api/schemas';
import { jfetch } from '$lib/api/JNovel.svelte';
import Notifications from '$lib/stores/Notifications.svelte.js';
import SerieAggregate from '$lib/types/SerieAggregate';

class SeriesClass {
	private _loading = false;
	private _series: ReturnType<typeof createArrayStore<Serie>>;

	private _currentSeries: SerieAggregate | null = $state(null);

	public get series() {
		return this._series.value;
	}

	public get current() {
		return this._currentSeries;
	}

	private _clearCurrent() {
		this._currentSeries = null;
	}

	constructor() {
		this._series = createArrayStore<Serie>([]);
		this._loading = false;
	}

	public fetchSeries = async () => {
		if (this._loading) {
			return;
		}

		this._loading = true;

		try {
			const res = await jfetch('/series?limit=10000', {
				method: 'POST',
				body: JSON.stringify({
					type: 1,
				}),
			});
			const json = await res.json();
			const data = SeriesListSchema.parse(json);

			const series = data.series.map((s) => new Serie(s));

			this._series.set(series);

			Notifications.success('Loaded series');
		} catch (e) {
			console.log(e);
			if (e instanceof TypeError) {
				Notifications.error('Failed to load series - no internet!');
			} else {
				Notifications.error(`Failed to load series: ${e}`);
			}
		} finally {
			this._loading = false;
		}
	};

	public fetchSeriesDetails = async (seriesId: string) => {
		if (this._currentSeries && this._currentSeries.id === seriesId) {
			return;
		}

		this._clearCurrent();

		try {
			const res = await jfetch(`/series/${seriesId}/aggregate`);
			const json = await res.json();

			this._currentSeries = new SerieAggregate(json);
		} catch (e) {
			console.log(e);
			if (e instanceof TypeError) {
				Notifications.error('Failed to load series - no internet!');
			} else {
				Notifications.error(`Failed to load series: ${e}`);
			}
		}
	};
}

const Series = new SeriesClass();
export default Series;

const SeriesListSchema = z.object({
	series: z.array(SerieSchema),
	pagination: PaginationScheme,
});
