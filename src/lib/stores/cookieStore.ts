import { get, writable } from "svelte/store";
// @ts-ignore
import { deleteCookie, getCookie, setCookie } from "../cookie";

export const cookieWritable = <T>(cookieName, initialValue: T) => {
	const currentCookie = getCookie(cookieName);
	if (currentCookie) {
		if (
			typeof initialValue === "string" ||
			typeof initialValue === "number" ||
			typeof initialValue === "boolean"
		) {
			initialValue = JSON.parse(currentCookie);
		} else {
			initialValue = { ...initialValue, ...JSON.parse(currentCookie) };
		}
	}

	const store = writable<T>(initialValue);

	const setWithCookie = (value: T) => {
		setCookie(cookieName, JSON.stringify(value), 365, false);
		store.set(value);
	};
	const deleteValue = () => {
		deleteCookie(cookieName);
		store.set(initialValue);
	};

	const saveToCookie = () => {
		const val = get(store);
		setCookie(cookieName, JSON.stringify(val), 365, false);
	};
	const updateWithCookie = (fn: (value: T) => T) => {
		const val = get(store);
		const updatedVal = fn(val);
		setCookie(cookieName, JSON.stringify(updatedVal), 365, false);
		store.set(updatedVal);
	};

	return {
		set: setWithCookie,
		update: updateWithCookie,
		subscribe: store.subscribe,
		delete: deleteValue,
		saveToCookie,
	};
};
