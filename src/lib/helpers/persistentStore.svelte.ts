import localforage from 'localforage';

export async function createPersistentStore<T>(key: string, initialValue: T) {
	await localforage.setDriver(localforage.INDEXEDDB);
	const previousValue = await localforage.getItem<T>(key);
	let value = previousValue || initialValue;

	// if this is an object, we want to ensure that all keys are present
	// even after updating initialValue in the future and adding new keys
	if (typeof initialValue === 'object') {
		value = structuredClone(initialValue);
		// @ts-expect-error - we checked that this is an object
		Object.assign(value, previousValue);
	}

	let current = $state<T>(value);

	const set = async (value: T) => {
		current = value;

		// this basically only saves options that differ from defaults
		// that way we can change defaults, and they will still be applied
		// unless the user has changed them
		if (typeof value === 'object') {
			const copy: T = { ...value };
			for (const key in initialValue) {
				if (copy[key] === initialValue[key]) {
					delete copy[key];
				}
			}
			await localforage.setItem(key, copy);
		} else {
			await localforage.setItem(key, value);
		}
	};
	const patch = (value: Partial<T>) => set({ ...current, ...value });
	const update = (fn: (value: T) => T) => set(fn(current));
	const reset = () => set(initialValue);

	return {
		set,
		patch,
		update,
		reset,
		get value() {
			return current;
		},
	};
}
