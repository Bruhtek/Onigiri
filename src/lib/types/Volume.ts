import toProperCase from "../utils/toProperCase";

export type Volume = {
	id: string;
	title: string;
	slug: string;
	number: number;
	originalPublisher: string;
	creators: {
		name: string;
		role: string;
	}[];
	forumTopicId: number;
	description: string;
	shortDescription: string;
	created: Date;
	coverURL: string;
	thumbnailURL: string;
	owned: boolean;
};

export const jsonToVolume = (json: any): Volume => {
	return {
		id: json.legacyId,
		slug: json.slug,
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
		number: json.number,
		originalPublisher: json.originalPublisher,
		creators: json.creators
			? json.creators.map((creator: any) => {
					return {
						name: creator.name,
						role: toProperCase(creator.role),
					};
			  })
			: [],
		forumTopicId: json.forumTopicId,
		owned: json.owned,
	};
};
