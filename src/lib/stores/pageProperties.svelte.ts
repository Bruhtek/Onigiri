import { createStore } from '$lib/helpers/store.svelte';

export const possibleDisplays = ['RELEASES', 'SERIES', 'VOLUMES'] as const;

type PageProperties = {
	pages: { [key in (typeof possibleDisplays)[number]]: number };
	currentDisplay: (typeof possibleDisplays)[number];
	itemsPerPage: number;
	itemsCount: number;
	loading: boolean;
	lastPage: boolean;
};

export const pageProperties = createStore<PageProperties>({
	// @ts-expect-error - Object from entries expands the type
	pages: Object.fromEntries(possibleDisplays.map((display) => [display, 0])),
	currentDisplay: 'RELEASES',
	itemsPerPage: -1,
	itemsCount: 0,
	loading: false,
	lastPage: false,
});
export const changePage = (direction: number) => {
	pageProperties.update((v) => {
		let page: number;
		if (direction < 0) {
			page = Math.max(0, v.pages[v.currentDisplay] - 1);
			page = Math.min(Math.ceil(v.itemsCount / v.itemsPerPage) - 1, page);
		} else {
			page = Math.max(0, v.pages[v.currentDisplay] + 1);
			page = Math.min(Math.ceil(v.itemsCount / v.itemsPerPage) - 1, page);
		}

		const pages = v.pages;
		pages[v.currentDisplay] = page;

		return { ...v, pages };
	});
};
export const setPage = (page: number) => {
	pageProperties.update((v) => {
		const pages = v.pages;
		pages[v.currentDisplay] = page;

		return { ...v, pages };
	});
};
