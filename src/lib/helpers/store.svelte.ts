export function createStore<T>(initialValue: T) {
	let current = $state<T>(initialValue);

	const set = (value: T) => {
		current = value;
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
