import { writable } from "svelte/store";
// @ts-ignore
import { deleteCookie, getCookie, setCookie } from "../cookie";

export const cookieWritable = <T>(cookieName, initialValue: T) => {
	const currentCookie = getCookie(cookieName);
	if (currentCookie) {
		initialValue = JSON.parse(currentCookie);
	}

	const { set, update, subscribe } = writable<T>(initialValue);
	const setWithCookie = (value: T) => {
		setCookie(cookieName, JSON.stringify(value), 5, false);
		set(value);
	};
	const deleteValue = () => {
		deleteCookie(cookieName);
		set(initialValue);
	};

	return {
		set: setWithCookie,
		update,
		subscribe,
		delete: deleteValue,
	};
};
