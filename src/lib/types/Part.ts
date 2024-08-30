import { z } from 'zod';
import type { LayoutItem, LayoutItemFactory } from '$lib/types/LayoutItem';

export const PartScheme = z.object({
	legacyId: z.string(),
	slug: z.string(),
	title: z.string(),
	number: z.number(),

	preview: z.boolean(),
	hidden: z.boolean(),

	created: z.string().datetime(),
	expiration: z.string().datetime().or(z.null()),
	launch: z.string().datetime(),

	cover: z
		.object({
			coverUrl: z.string().optional(),
			thumbnailUrl: z.string().optional(),
			originalUrl: z.string().optional()
		})
		.or(z.null()),

	progress: z.number(),
	totalMangaPages: z.number()
});

class Part implements LayoutItemFactory {
	legacyId: string;
	slug: string;
	title: string;
	number: number;

	preview: boolean;
	hidden: boolean;

	created: Date;
	expiration: Date;
	launch: Date;

	coverURL: string;
	thumbnailURL: string;

	progress: number;
	totalMangaPages: number;

	type: 'NOVEL' | 'MANGA';

	/**
	 * Constructor for Part
	 * @param api_result - JSON object from the API
	 */
	constructor(api_result: unknown) {
		const json = PartScheme.parse(api_result);

		this.legacyId = json.legacyId;
		this.slug = json.slug;
		this.title = json.title;
		this.number = json.number;

		this.preview = json.preview;
		this.hidden = json.hidden;

		this.created = new Date(json.created);
		// if expiration is null, set it to a very large number, so that it's treated as never-expiring
		this.expiration =
			typeof json.expiration === 'string' ? new Date(json.expiration) : new Date(8.64e15);
		this.launch = new Date(json.launch);

		this.thumbnailURL = json.cover
			? json.cover.thumbnailUrl ||
				json.cover.coverUrl ||
				json.cover.originalUrl ||
				'https://placehold.co/200x300'
			: 'https://placehold.co/200x300';

		this.coverURL = json.cover
			? json.cover.coverUrl ||
				json.cover.thumbnailUrl ||
				json.cover.originalUrl ||
				'https://placehold.co/200x300'
			: 'https://placehold.co/200x300';

		this.progress = json.progress;
		this.totalMangaPages = json.totalMangaPages;

		// check if either slug, thumbnailURL or coverURL contains the word 'manga'
		if (
			['manga', 'Manga'].some(
				(word) =>
					this.slug.includes(word) ||
					this.thumbnailURL.includes(word) ||
					this.coverURL.includes(word)
			)
		) {
			this.type = 'MANGA';
		} else {
			this.type = 'NOVEL';
		}
	}

	toLayoutItem(): LayoutItem {
		return {
			title: this.title,
			type: this.type,
			imageSrc: this.thumbnailURL,
			HDImageSrc: this.coverURL,
			href: `/reader/${this.legacyId}`
		};
	}
}

export default Part;
