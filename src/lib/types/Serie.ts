import Volume from '$lib/types/Volume';

class Serie {
	legacyId: string;
	slug: string;
	type: "NOVEL" | "MANGA";
	title: string;
	description: string;
	shortDescription: string;
	coverURL: string;
	thumbnailURL: string;
	created: Date;
	tags: string[];

	following: boolean;
	catchup: boolean;

	volumes: Volume[] = [];

	/**
	 * Constructor for Series
	 * @param json - JSON object from the API
	 */
	//eslint-disable-next-line
	constructor(json: any) {
		this.legacyId = json.legacyId;
		this.slug = json.slug;
		this.type = json.type;
		this.title = json.title;
		this.description = json.description;
		this.shortDescription = json.shortDescription;

		this.coverURL = json.cover
		? json.cover.coverUrl || json.cover.thumbnailUrl || json.cover.originalUrl
		: "https://placehold.co/200x300";
		
		this.thumbnailURL = json.cover
		? json.cover.thumbnailUrl || json.cover.coverUrl || json.cover.originalUrl
		: "https://placehold.co/200x300";

		this.created = new Date(json.created);
		this.tags = json.tags;

		this.following = json.following;
		this.catchup = json.catchup;
	}
}

export default Serie;