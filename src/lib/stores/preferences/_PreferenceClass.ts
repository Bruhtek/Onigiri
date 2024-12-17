import type { createPersistentStore } from '$lib/helpers/persistentStore.svelte';

class PreferenceClass<T> {
	private _store: Awaited<ReturnType<typeof createPersistentStore<T>>>;

	constructor(_store: typeof this._store) {
		this._store = _store;
	}

	get v() {
		return this._store.value;
	}

	set v(value: T) {
		this._store.set(value);
	}

	patch = async (value: Partial<T>) => {
		await this._store.patch(value);
	};
	reset = async () => {
		await this._store.reset();
	};
}

export default PreferenceClass;
