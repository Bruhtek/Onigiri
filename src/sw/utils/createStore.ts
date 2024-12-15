export const createStore = <T>(initialValue: T) => {
	let value = initialValue;

	const set = (newValue: T) => {
		value = newValue;
	};

	return {
		set,
		get value() {
			return value;
		},
	};
};
