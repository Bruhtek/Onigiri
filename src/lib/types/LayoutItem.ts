export type LayoutItem = {
	title: string;
	type: 'NOVEL' | 'MANGA';
	imageSrc: string;
	HDImageSrc?: string;
	href: string | ((current: string) => string);
	progress?: number;
	longPressHref?: string;
	indexes?: () => string;
	titleWithoutIndexes?: () => string;
	following?: boolean;
	catchup?: boolean;
	disabled?: boolean;
};

export interface LayoutItemFactory {
	toLayoutItem: () => LayoutItem;
}

// we accept either a prepared LayoutItem, or an object that can be converted to a LayoutItem
export type LayoutItemProp = LayoutItem | LayoutItemFactory;
