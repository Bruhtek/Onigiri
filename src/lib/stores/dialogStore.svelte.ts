import { createStore } from '$lib/helpers/store.svelte';

type DialogStore = {
	title: string;
	description: string;
	hotReload?: boolean;
} & (
	| {
			type: 'number';
			currentValue: number;
			callback: (v: number) => unknown; //returns number with type number, index with type enum
	  }
	| {
			type: 'string';
			currentValue: string;
			callback: (v: string) => unknown; //returns number with type number, index with type enum
	  }
);

export const dialogStore = createStore<DialogStore | undefined>(undefined);

const requestDialog = (v: DialogStore) => {
	dialogStore.set(v);
};

export default requestDialog;
