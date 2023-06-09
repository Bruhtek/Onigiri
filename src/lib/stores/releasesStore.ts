import { get, writable } from "svelte/store";
import type { VolumePart } from "../types/VolumePart";
import { jfetch } from "../jnovel";
import { jsonToVolumePart } from "../types/VolumePart";

export const releases = writable<VolumePart[]>([]);

export const getMoreReleases = async (count: number = 40) => {
	const currentCount = get(releases).length;

	const res = await jfetch(`/releases?limit=${count}&skip=${currentCount}`);

	if (res.ok) {
		const data = await res.json();
		const newReleases = data.parts.map((part: any) =>
			jsonToVolumePart(part),
		);

		releases.update((old) => [...old, ...newReleases]);
	}
};
