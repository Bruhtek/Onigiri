import { z } from 'zod';
import Part, { PartScheme } from '$lib/types/Part';
import { updateReleaseProgress } from '$lib/api/releases.svelte';
import { jfetch } from '$lib/api/jnovel.svelte';

const partTocSchema = z.object({
	parts: z.object({ parts: z.array(PartScheme) }),
	seriesTitle: z.string(),
});

// #region Parts
export const updatePartProgress = async (partId: string, progress: number) => {
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
};

// #region Parts TOC
export type PartTocResult = {
	partIndex: number;
	progress: number;
	nextPartId?: string;
	previousPartId?: string;
	partIndexes: string;
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

	let prevId: string | undefined = undefined;
	let nextId: string | undefined = undefined;

	if (currentPartIndex > 0) {
		prevId = toc.data.parts.parts[currentPartIndex - 1].id;
	}
	if (currentPartIndex < toc.data.parts.parts.length - 1) {
		nextId = toc.data.parts.parts[currentPartIndex + 1].id;
	}

	const currentPart = new Part(toc.data.parts.parts[currentPartIndex]);

	return {
		partIndex: currentPartIndex + 1,
		nextPartId: nextId,
		previousPartId: prevId,
		seriesTitle: toc.data.seriesTitle,
		partIndexes: currentPart.getFullIndexes(),
		progress: currentPart.progress,
		error: undefined,
	};
};
