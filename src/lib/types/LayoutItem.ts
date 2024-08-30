export type LayoutItem = {
	title: string;
	type: 'NOVEL' | 'MANGA';
	imageSrc: string;
	HDImageSrc?: string;
	href: string | ((event: MouseEvent) => Promise<string>);
	longPressHref?: string | ((event: MouseEvent) => Promise<string>);
};

export interface LayoutItemFactory {
	toLayoutItem: () => LayoutItem;
}

// we accept either a prepared LayoutItem, or an object that can be converted to a LayoutItem
export type LayoutItemProp = LayoutItem | LayoutItemFactory;
