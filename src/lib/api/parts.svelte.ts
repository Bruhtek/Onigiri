import { z } from 'zod';
import Part, { PartScheme } from '$lib/types/Part';
import { updateReleaseProgress } from '$lib/api/releases.svelte';
import { jfetch } from '$lib/api/jnovel.svelte';

const partTocSchema = z.object({
	parts: z.object({ parts: z.array(PartScheme) }),
	seriesTitle: z.string(),
});

// #region Parts
let debounceTimer = $state<number | NodeJS.Timeout>(0);
export const updatePartProgress = (partId: string, progress: number) => {
	clearTimeout(debounceTimer);

	debounceTimer = setTimeout(async () => {
		const promise = jfetch(`/me/completion/${partId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/x-protobuf',
			},
			body: progress.toFixed(5),
		});

		updateReleaseProgress(partId, progress);

		const res = await promise;
		if (!res.ok) {
			console.error('Error updating progress - status code ' + res.status);
		}
	}, 500);
};

// #region Parts TOC
export type PartTocResult = {
	partIndex: number;
	nextPart?: Part;
	previousPart?: Part;
	currentPart: Part;
	seriesTitle: string;
};
export const isPartTocResult = (res: PartTocResult | { error: string }): res is PartTocResult => {
	return !('error' in res) || !res['error'];
};

export const parse_part_toc = (
	json: unknown,
	partId: string,
):
	| { error: string }
	| ({
			error: undefined;
	  } & PartTocResult) => {
	const toc = partTocSchema.safeParse(json);

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
		partIndex: currentPartIndex + 1,
		seriesTitle: toc.data.seriesTitle,
		currentPart: currentPart,
		nextPart: nextPart,
		previousPart: prevPart,
		error: undefined,
	};
};
