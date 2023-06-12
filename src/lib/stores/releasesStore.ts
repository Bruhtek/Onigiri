import { get, writable } from "svelte/store";
import type { VolumePart } from "../types/VolumePart";
import { jfetch } from "../jnovel";
import { jsonToVolumePart } from "../types/VolumePart";
import { cookieWritable } from "./cookieStore";

export const releases = writable<VolumePart[]>([]);
export const releasesPage = writable<number>(0);
export const onlyFollowedReleases = cookieWritable<boolean>(
	"releasesOnlyFollows",
	false,
);

export const getMoreReleases = async (count: number = 40) => {
	const currentCount = get(releases).length;

	const res = await jfetch(
		`/releases?limit=${count}&skip=${currentCount}&only_follows=${get(
			onlyFollowedReleases,
		)}`,
	);

	if (res.ok) {
		const data = await res.json();
		const newReleases = data.parts.map((part: any) =>
			jsonToVolumePart(part),
		);

		releases.update((old) => [...old, ...newReleases]);
	}
};

export const getPartById = (id: string): VolumePart | null => {
	const current = get(releases);
	const found = current.find((r) => r.id === id);

	if (found) {
		return found;
	}

	return null;
};

export const setPartProgress = async (id: string, progress: number) => {
	console.log(id, progress);
	const current = get(releases);
	const found = current.findIndex((r) => r.id === id);

	if (found !== -1) {
		current[found].progress = progress;
		releases.update((old) => [...old]);

		await _updatePartProgress(current[found]);
	}
};

const _updatePartProgress = async (part: VolumePart) => {
	await jfetch(`/me/completion/${part.id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "text/plain",
		},
		body: part.progress.toString(),
	});
};
