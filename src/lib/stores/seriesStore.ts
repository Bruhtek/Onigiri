import { get, writable } from "svelte/store";
import type { Series } from "../types/Series";
import { jsonToSeries } from "../types/Series";
import { jfetch } from "../jnovel";
import notificationStore from "./notificationStore";

export const series = writable<Series[]>([]);
export const seriesPage = writable<number>(0);
export const onlyFollowedSeries = writable<boolean>(false);
export const onlyCatchupSeries = writable<boolean>(false);

export const lastSeriesPage = writable<boolean>(false);

export const getMoreSeries = async (count: number = 40) => {
	if (get(lastSeriesPage)) {
		return;
	}

	const currentCount = get(series).length;

	const res = await jfetch(`/series?limit=${count}&skip=${currentCount}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			only_follows: get(onlyFollowedSeries),
			only_catchups: get(onlyCatchupSeries),
		}),
	});

	if (res.ok) {
		const data = await res.json();
		const newSeries = data.series.map((serie: any) => jsonToSeries(serie));

		lastSeriesPage.set(data.pagination.lastPage);

		series.update((oldSeries) => {
			let result = [...oldSeries];
			for (const serie of newSeries) {
				if (!result.find((s) => s.id === serie.id)) {
					result.push(serie);
				}
			}
			return result;
			// return [...oldSeries, ...newSeries];
		});
		return;
	}

	if (res.status === 429) {
		notificationStore.set({
			type: "error",
			message:
				"You are being rate limited. Please wait a few seconds and try again.",
		});
		return;
	}

	notificationStore.set({
		type: "error",
		message:
			"Failed to fetch releases. Error code: " +
			res.status +
			" " +
			res.statusText,
	});
};
