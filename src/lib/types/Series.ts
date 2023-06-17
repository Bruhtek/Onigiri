import type { VolumePart } from "./VolumePart";
import type { Volume } from "./Volume";

export type Series = {
	id: string;
	slug: string;
	type: "NOVEL" | "MANGA";
	title: string;
	description: string;
	shortDescription: string;
	coverURL: string;
	thumbnailURL: string;
	created: Date;
	tags: string[];
};

export type SeriesAggregate = {
	series: Series;
	volumes: {
		volume: Volume;
		parts: VolumePart[];
	}[];
};

export const jsonToSeries = (json: any): Series => {
	return {
		id: json.legacyId,
		slug: json.slug,
		type: json.type,
		title: json.title,
		description: json.description,
		shortDescription: json.shortDescription,
		coverURL: json.cover
			? json.cover.coverUrl
			: "https://placehold.co/200x300",
		thumbnailURL: json.cover
			? json.cover.thumbnailUrl
			: "https://placehold.co/200x300",
		created: new Date(json.created),
		tags: json.tags,
	};
};

export const getSeriesAuthor = (series: SeriesAggregate): string => {
	for (const volume of series.volumes) {
		for (const creator of volume.volume.creators) {
			if (creator.role === "Author") {
				return creator.name;
			}
		}
	}
	return "Unknown";
};
