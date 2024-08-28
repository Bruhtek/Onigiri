class Volume {
	legacyId: string;
	slug: string;
	title: string;
	number: number;
	creators: Creator[] = [];

	owned: boolean;
	created: Date;
	publishing: Date;

	description: string;
	shortDescription: string;

	coverURL: string;
	thumbnailURL: string;

	totalParts: number;

	/**
	 * Constructor for Volume
	 * @param json - JSON object from the API
	 */
	//eslint-disable-next-line
	constructor(json: any) {
		this.legacyId = json.legacyId;
		this.slug = json.slug;
		this.title = json.title;
		this.number = json.number;

		if (json.creators) {
			//eslint-disable-next-line
			this.creators = json.creators.map((creator: any) => ({
				name: creator.name,
				role: creator.role,
				originalName: creator.originalName
			}));
		}

		this.owned = json.owned;
		this.description = json.description;
		this.shortDescription = json.shortDescription;
		this.created = new Date(json.created);
		this.publishing = new Date(json.publishing);

		this.coverURL = json.cover
			? json.cover.coverUrl || json.cover.thumbnailUrl || json.cover.originalUrl
			: "https://placehold.co/200x300";

		this.thumbnailURL = json.cover
			? json.cover.thumbnailUrl || json.cover.coverUrl || json.cover.originalUrl
			: "https://placehold.co/200x300";

		this.totalParts = json.totalParts;
	}
}

export type Creator = {
	name: string;
	role: string;
	originalName: string;
}

export default Volume;