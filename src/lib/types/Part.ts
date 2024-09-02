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
			originalUrl: z.string().optional(),
		})
		.or(z.null()),

	progress: z.number(),
	totalMangaPages: z.number(),
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
			href: `/reader/${this.legacyId}`,
			indexes: this.getIndexes.bind(this),
			titleWithoutIndexes: this.getTitleWithoutIndexes.bind(this),
		};
	}

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
					this.coverURL.includes(word),
			)
		) {
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
