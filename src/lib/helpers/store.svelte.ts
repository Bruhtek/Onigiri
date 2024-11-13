export function createStore<T>(initialValue: T) {
	let current = $state<T>(initialValue);

	const set = (value: T) => {
		current = value;
	};
	const update = (fn: (value: T) => T) => set(fn(current));
	const reset = () => set(initialValue);
	const patch = (value: Partial<T>) => set({ ...current, ...value });

	return {
		set,
		update,
		reset,
		patch,
		get value() {
			return current;
		},
	};
}
