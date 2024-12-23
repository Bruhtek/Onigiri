import { z } from 'zod';
import type { LayoutItem, LayoutItemFactory } from '$lib/types/LayoutItem';
import _IndexesClass from '$lib/types/_IndexesClass';

export const PartSchema = z.object({
	id: z.string(),

	legacyId: z.string(),
	title: z.string(),
	shortTitle: z.string(),

	slug: z.string(),
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
			originalUrl: z.string().optional(),
		})
		.or(z.null()),

	progress: z.number(),
	totalMangaPages: z.number(),
});

class Part extends _IndexesClass implements LayoutItemFactory {
	id: string;
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

	get released(): boolean {
		return this.launch <= new Date();
	}

	toLayoutItem(): LayoutItem {
		return {
			title: this.title,
			type: this.type,
			imageSrc: this.thumbnailURL,
			HDImageSrc: this.coverURL,
			href: `/reader/${this.id}`,
			longPressHref: `/series/by-partId/${this.id}`,
			indexes: this.getIndexes.bind(this),
			disabled: !this.released,
			titleWithoutIndexes: this.getTitleWithoutIndexes.bind(this),
			progress: this.progress,
		};
	}

	/**
	 * Constructor for Part
	 * @param api_result - JSON object from the API
	 */
	constructor(api_result: z.infer<typeof PartSchema>) {
		super();
		this.id = api_result.id;
		this.legacyId = api_result.legacyId;
		this.slug = api_result.slug;
		this.title = api_result.title;
		this.number = api_result.number;

		this.preview = api_result.preview;
		this.hidden = api_result.hidden;

		this.created = new Date(api_result.created);
		// if expiration is null, set it to a very large number, so that it's treated as never-expiring
		this.expiration =
			typeof api_result.expiration === 'string'
				? new Date(api_result.expiration)
				: new Date(8.64e15);
		this.launch = new Date(api_result.launch);

		this.thumbnailURL = api_result.cover
			? api_result.cover.thumbnailUrl ||
				api_result.cover.coverUrl ||
				api_result.cover.originalUrl ||
				'https://placehold.co/200x300'
			: 'https://placehold.co/200x300';

		this.coverURL = api_result.cover
			? api_result.cover.coverUrl ||
				api_result.cover.thumbnailUrl ||
				api_result.cover.originalUrl ||
				'https://placehold.co/200x300'
			: 'https://placehold.co/200x300';

		this.progress = api_result.progress;
		this.totalMangaPages = api_result.totalMangaPages;

		// it has been confirmed (by chocolatey on J-Novel discord)
		// that all manga parts have shortTitle in the form of Chapter X,
		// while all the novels have it as Part X
		// we check if it matches.
		if (api_result.shortTitle.startsWith('Chapter ')) {
			this.type = 'MANGA';
		} else {
			this.type = 'NOVEL';
		}
	}
}

export default Part;
