import { jfetch } from '$lib/api/JNovel.svelte';
import Releases from '$lib/api/Releases.svelte.js';
import type { Result } from '$lib/types/HelperTypes';
import Part, { PartScheme } from '$lib/types/Part';
import { z } from 'zod';

class PartsClass {
	private _debounceTimer = $state<number | NodeJS.Timeout>(0);

	constructor() {}

	public updatePartProgress = (partId: string, progress: number) => {
		clearTimeout(this._debounceTimer);

		this._debounceTimer = setTimeout(async () => {
			const promise = jfetch(`/me/completion/${partId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/x-protobuf',
				},
				body: progress.toFixed(5),
			});

			Releases.updateReleaseProgress(partId, progress);

			const res = await promise;
			if (!res.ok) {
				console.error('Error updating progress - status code ' + res.status);
			}
		}, 500);
	};

	public parsePartToc = (json: unknown, partId: string): Result<PartTocResult> => {
		const toc = PartTocSchema.safeParse(json);

		if (!toc.success) {
			console.error(toc.error);
			return { error: 'Invalid data returned from API' };
		}

		const currentPartIndex = toc.data.parts.parts.findIndex((part) => part.id === partId);
		if (currentPartIndex == -1) {
			return { error: 'Part not found in the TOC' };
		}

		let prevPart: Part | undefined = undefined;
		let nextPart: Part | undefined = undefined;

		if (currentPartIndex > 0) {
			prevPart = new Part(toc.data.parts.parts[currentPartIndex - 1]);
		}
		if (currentPartIndex < toc.data.parts.parts.length - 1) {
			nextPart = new Part(toc.data.parts.parts[currentPartIndex + 1]);
		}

		const currentPart = new Part(toc.data.parts.parts[currentPartIndex]);

		return {
			error: false,
			data: {
				partIndex: currentPartIndex + 1,
				seriesTitle: toc.data.seriesTitle,
				currentPart: currentPart,
				nextPart: nextPart,
				previousPart: prevPart,
			},
		};
	};
}

const Parts = new PartsClass();
export default Parts;

export const PartTocSchema = z.object({
	parts: z.object({ parts: z.array(PartScheme) }),
	seriesTitle: z.string(),
});
export type PartTocResult = {
	partIndex: number;
	nextPart?: Part;
	previousPart?: Part;
	currentPart: Part;
	seriesTitle: string;
};
