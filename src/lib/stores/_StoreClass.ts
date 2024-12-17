import { createStore } from '$lib/helpers/store.svelte';

class StoreClass<T> {
	private _store: Awaited<ReturnType<typeof createStore<T>>>;

	constructor(_store: typeof this._store) {
		this._store = _store;
	}

	get v() {
		return this._store.value;
	}

	set v(value: T) {
		this._store.set(value);
	}

	patch = (value: Partial<T>) => {
		this._store.patch(value);
	};
}

export default StoreClass;
