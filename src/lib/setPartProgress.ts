import { get } from "svelte/store";
import { jfetch } from "./jnovel";
import { releases } from "./stores/releasesStore";
import { seriesAggregate } from "./stores/seriesStore";

export const setPartProgress = async (id: string, progress: number) => {
	let releases = updateProgressInReleases(id, progress);
	let volumes = updateProgressInVolumes(id, progress);
	if (releases || volumes) {
		await _updatePartProgress(id, progress);
	}
};

const updateProgressInReleases = (id: string, progress: number) => {
	const current = get(releases);
	const found = current.findIndex((r) => r.id === id);

	if (found !== -1) {
		current[found].progress = progress;
		releases.update((old) => [...old]);

		return true;
	}

	return false;
};

const updateProgressInVolumes = (id: string, progress: number) => {
	const current = get(seriesAggregate);
	if (!current) return false;

	for (const volume of current.volumes) {
		for (const part of volume.parts) {
			if (part.id === id) {
				part.progress = progress;
				seriesAggregate.update((old) => ({ ...old }));
				return true;
			}
		}
	}
};

const _updatePartProgress = async (id: string, progress: number) => {
	await jfetch(`/me/completion/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "text/plain",
		},
		body: progress.toString(),
	});
};
