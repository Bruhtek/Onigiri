import { z } from 'zod';
import type { LayoutItem, LayoutItemFactory } from '$lib/types/LayoutItem';
import _IndexesClass from '$lib/types/_IndexesClass';

export const VolumeSchema = z.object({
	id: z.string(),
	legacyId: z.string(),
	slug: z.string(),
	title: z.string(),
	number: z.number(),
	creators: z.array(
		z.object({
			name: z.string(),
			role: z.string(),
			originalName: z.string(),
		}),
	),
	owned: z.boolean(),
	description: z.string(),
	shortDescription: z.string(),
	created: z.string(),
	publishing: z.string(),
	cover: z.object({
		coverUrl: z.string().optional(),
		thumbnailUrl: z.string().optional(),
		originalUrl: z.string().optional(),
	}),
	totalParts: z.number(),
});

class Volume extends _IndexesClass implements LayoutItemFactory {
	id: string;
	legacyId: string;
	slug: string;
	title: string;
	number: number;
	_creators: Creator[] = [];

	owned: boolean;
	created: Date;
	publishing: Date;

	description: string;
	shortDescription: string;

	coverURL: string;
	thumbnailURL: string;

	totalParts: number;

	get creators(): { [key: string]: string[] } {
		const roles: { [key: string]: string[] } = {};
		for (const creator of this._creators) {
			if (roles[creator.role] === undefined) {
				roles[creator.role] = [];
			}
			if (!roles[creator.role].includes(creator.name)) {
				roles[creator.role].push(creator.name);
			}
		}
		return roles;
	}

	public toLayoutItem(): LayoutItem {
		return {
			title: this.getFullIndexes() || this.title,
			type: 'NOVEL',
			imageSrc: this.thumbnailURL,
			HDImageSrc: this.coverURL,
			href: (current: string) => current + `/volume/${this.id}`,
			description: this.description,
		};
	}

	/**
	 * Constructor for Volume
	 * @param api_result - object from the API
	 */
	constructor(api_result: unknown) {
		super();
		const json = VolumeSchema.parse(api_result);

		this.id = json.id;
		this.legacyId = json.legacyId;
		this.slug = json.slug;
		this.title = json.title;
		this.number = json.number;

		if (json.creators) {
			this._creators = json.creators.map((creator) => ({
				name: creator.name,
				role: creator.role,
				originalName: creator.originalName,
			}));
		}

		this.owned = json.owned;
		this.description = json.description;
		this.shortDescription = json.shortDescription;
		this.created = new Date(json.created);
		this.publishing = new Date(json.publishing);

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

		this.totalParts = json.totalParts;
	}
}

export type Creator = {
	name: string;
	role: string;
	originalName: string;
};

export default Volume;
