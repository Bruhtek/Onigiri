import * as localforage from 'localforage';

localforage.config({
	driver: localforage.INDEXEDDB,
	name: 'j-novel-eink',
	version: 1.0,
	storeName: 'j-novel-eink',
});

export async function createPersistentStore<T>(key: string, initialValue: T) {
	const previousValue = await localforage.getItem<T>(key);
	let current = $state<T>(previousValue || initialValue);

	const set = async (value: T) => {
		current = value;
		await localforage.setItem(key, value);
	}
	const update = (fn: (value: T) => T) => set(fn(current));
	const reset = () => set(initialValue);

	return {
		set,
		update,
		reset,
		get value() {
			return current;
		}
	}
}