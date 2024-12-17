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

class DialogClass {
	constructor() {}

	public get current() {
		return this.dialogStore.value;
	}

	public clear() {
		this.dialogStore.set(undefined);
	}

	protected dialogStore = createStore<DialogStore | undefined>(undefined);

	public requestDialog = (v: DialogStore) => {
		this.dialogStore.set(v);
	};
}

const Dialog = new DialogClass();
export default Dialog;
