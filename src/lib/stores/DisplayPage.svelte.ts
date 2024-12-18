import { createStore } from '$lib/helpers/store.svelte';
import StoreClass from '$lib/stores/_StoreClass';

export const possibleDisplays = ['RELEASES', 'SERIES', 'VOLUMES', 'OTHER'] as const;
type PossibleDisplay = (typeof possibleDisplays)[number];

type DisplayPage = {
	pages: { [key in PossibleDisplay]: number };
	currentDisplay: PossibleDisplay;
	itemsPerPage: number;
	itemsCount: number;
	lastPage: boolean;
};

const displayPage = createStore<DisplayPage>({
	// @ts-expect-error - Object from entries expands the type
	pages: Object.fromEntries(possibleDisplays.map((display) => [display, 0])),
	currentDisplay: 'OTHER',
	itemsPerPage: -1,
	itemsCount: 0,
	lastPage: false,
});

class DisplayPageStore extends StoreClass<DisplayPage> {
	changePage = (direction: number) => {
		displayPage.update((v) => {
			let page: number;
			page = Math.max(0, v.pages[v.currentDisplay] + direction);
			page = Math.min(Math.ceil(v.itemsCount / v.itemsPerPage) - 1, page);

			const pages = v.pages;
			pages[v.currentDisplay] = page;

			return { ...v, pages };
		});
	};

	setPage = (page: number) => {
		displayPage.update((v) => {
			const pages = v.pages;
			pages[v.currentDisplay] = page;

			return { ...v, pages };
		});
	};

	public get currentPage() {
		return this.v.pages[this.v.currentDisplay];
	}

	public set currentDisplay(currentDisplay: PossibleDisplay) {
		this.patch({ currentDisplay });
	}

	public setPageForDisplay(page: number, display: PossibleDisplay) {
		displayPage.update((v) => {
			const pages = v.pages;
			pages[display] = page;
			return { ...v, pages };
		});
	}
}

const DisplayPage = new DisplayPageStore(displayPage);
export default DisplayPage;
