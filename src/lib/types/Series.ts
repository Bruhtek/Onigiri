export type Series = {
	id: number;
	slug: string;
	type: "NOVEL" | "MANGA";
	title: string;
	description: string;
	shortDescription: string;
	coverURL: string;
	thumbnailURL: string;
	created: Date;
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
	};
};
