import * as localforage from 'localforage';

export async function createPersistentStore<T>(key: string, initialValue: T) {
	const previousValue = await localforage.getItem<T>(key);
	let value = previousValue || initialValue;

	// if this is an object, we want to ensure that all keys are present - even when updating initialValue in the future
	if (typeof initialValue === 'object') {
		value = initialValue;
		// @ts-expect-error - we checked that this is an object
		Object.assign(value, previousValue);
	}

	let current = $state<T>(value);

	const set = async (value: T) => {
		current = value;
		await localforage.setItem(key, value);
	};
	const update = (fn: (value: T) => T) => set(fn(current));
	const reset = () => set(initialValue);

	return {
		set,
		update,
		reset,
		get value() {
			return current;
		}
	};
}
