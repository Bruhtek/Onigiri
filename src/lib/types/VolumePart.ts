export type VolumePart = {
	id: string;
	title: string;
	slug: string;
	partNumber: number;
	volumeNumber?: number;
	launchDate: Date;
	expired?: boolean;
	expirationDate?: Date;
	coverURL: string;
	thumbnailURL: string;
	progress: number;
	isManga: boolean;
};

export const jsonToVolumePart = (json: any): VolumePart => {
	const isManga = json.totalMangaPages || (json.cover && json.cover.coverURL && json.cover.coverURL.includes("Manga"));
	const expired = json.expiration && new Date(json.expiration) < new Date();

	return {
		id: json.legacyId,
		title: json.title,
		slug: json.slug,
		volumeNumber: tryParseVolume(json.title) || 0,
		partNumber: tryParsePart(json.title) || 0,
		launchDate: new Date(json.launch),
		expirationDate: json.expiration ? new Date(json.expiration) : undefined,
		coverURL: json.cover
			? json.cover.coverUrl
			: "https://placehold.co/200x300",
		thumbnailURL: json.cover
			? json.cover.thumbnailUrl
			: "https://placehold.co/200x300",
		progress: json.progress,
		isManga: isManga,
		expired: expired,
	};
};

const tryParseVolume = (title: string) => {
	const regex = [/Volume\.? (\d+)/i, /Vol\.? (\d+)/i];
	const match = title.match(regex[0]) || title.match(regex[1]);

	if (match) {
		return parseInt(match[1]);
	}

	return undefined;
};

const tryParsePart = (title: string) => {
	const regex = [/Part\.? (\d+)/i, /Pt\.? (\d+)/i];
	const match = title.match(regex[0]) || title.match(regex[1]);

	if (match) {
		return parseInt(match[1]);
	}

	return undefined;
};
