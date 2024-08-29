import { z } from 'zod';

export const SerieSchema = z.object({
	id: z.string(),
	legacyId: z.string(),
	type: z.enum(['NOVEL', 'MANGA']),
	title: z.string(),
	description: z.string(),
	shortDescription: z.string(),
	slug: z.string(),
	created: z.string().datetime(),
	tags: z.array(z.string()),
	cover: z.object({
		coverUrl: z.string().optional(),
		thumbnailUrl: z.string().optional(),
		originalUrl: z.string().optional()
	}),
	following: z.boolean(),
	catchup: z.boolean()
});

class Serie {
	legacyId: string;
	slug: string;
	type: 'NOVEL' | 'MANGA';
	title: string;
	description: string;
	shortDescription: string;
	coverURL: string;
	thumbnailURL: string;
	created: Date;
	tags: string[];

	following: boolean;
	catchup: boolean;

	/**
	 * Constructor for Series
	 * @param api_result - JSON object from the API
	 */
	constructor(api_result: unknown) {
		const json = SerieSchema.parse(api_result);

		this.legacyId = json.legacyId;
		this.slug = json.slug;
		this.type = json.type;
		this.title = json.title;
		this.description = json.description;
		this.shortDescription = json.shortDescription;

		this.coverURL = json.cover
			? json.cover.coverUrl ||
				json.cover.thumbnailUrl ||
				json.cover.originalUrl ||
				'https://placehold.co/200x300'
			: 'https://placehold.co/200x300';

		this.thumbnailURL = json.cover
			? json.cover.thumbnailUrl ||
				json.cover.coverUrl ||
				json.cover.originalUrl ||
				'https://placehold.co/200x300'
			: 'https://placehold.co/200x300';

		this.created = new Date(json.created);
		this.tags = json.tags;

		this.following = json.following;
		this.catchup = json.catchup;
	}
}

export default Serie;
