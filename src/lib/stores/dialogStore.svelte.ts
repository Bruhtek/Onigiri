import { createStore } from '$lib/helpers/store.svelte';

type DialogStore = {
	title: string;
	description: string;
	callback: (v: number) => unknown; //returns number with type number, index with type enum
} & {
	type: 'number';
	currentValue: number;
};

export const dialogStore = createStore<DialogStore | undefined>(undefined);

const requestDialog = (v: DialogStore) => {
	dialogStore.set(v);
};

export default requestDialog;
