import { z } from 'zod';
import type { LayoutItem, LayoutItemFactory } from '$lib/types/LayoutItem';

export const PartScheme = z.object({
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

class Part implements LayoutItemFactory {
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

	_indexes: Index[] = [];

	get indexes(): Index[] {
		// we cache the indexes so we don't have to recalculate them every time, especially since they're constant
		if (this._indexes && this._indexes.length > 0) return this._indexes;

		const index = ['Arc', 'Chapter', 'Volume', 'Part', 'Book', 'Fanbook'] as const;
		const regexes = {
			Arc: /Arc (\d+)/,
			Chapter: /Chapter (\d+)/,
			Volume: /(?:Volume|Vol.) (\d+)/,
			Part: /Part (\d+)/,
			Book: /Book (\d+)/,
			Fanbook: /Fanbook (\d+)/,
		};
		const indexes: Index[] = [];
		for (const key of index) {
			const match = this.title.match(regexes[key]);
			if (match) {
				indexes.push({ index: match.index!, value: match[1], name: key[0], match: match });
			}
		}
		indexes.sort((a, b) => a.index - b.index);
		this._indexes = indexes;

		return indexes;
	}

	getIndexes(): string {
		return this.indexes.map((i) => `${i.name}. ${i.value}`).join(' ');
	}

	getTitleWithoutIndexes(): string {
		const indexes = this.indexes;
		const earliestIndex = indexes.length > 0 ? indexes[0].index : this.title.length;
		return this.title.slice(0, earliestIndex).trim().replace(/:$/, '');
	}

	toLayoutItem(): LayoutItem {
		return {
			title: this.title,
			type: this.type,
			imageSrc: this.thumbnailURL,
			HDImageSrc: this.coverURL,
			href: `/reader/${this.id}`,
			indexes: this.getIndexes.bind(this),
			titleWithoutIndexes: this.getTitleWithoutIndexes.bind(this),
			progress: this.progress,
		};
	}

	/**
	 * Constructor for Part
	 * @param api_result - JSON object from the API
	 */
	constructor(api_result: z.infer<typeof PartScheme>) {
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

		// it has been confirmed (by chocolatey on discord)
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

type Index = {
	index: number;
	value: string;
	name: string;
	match: RegExpMatchArray;
};
