import { get } from "svelte/store";
import { token as tokenStore } from "./stores/accountStore";
import type { VolumePart } from "./types/VolumePart";
import { jsonToVolumePart } from "./types/VolumePart";
import notificationStore from "./stores/notificationStore";

// const jnovelURL = "https://labs.j-novel.club";

const dev = process.env.NODE_ENV === "development";
if (dev)
	console.log(
		"Running in development mode. Requests will be proxied through https://cors.bruhtek.com/",
	);

const jnovelURL = dev
	? "https://cors.bruhtek.com/https://labs.j-novel.club"
	: "https://labs.j-novel.club";

const apiURL = "/app/v1";
const embedURL = "/embed";

const releasesOnPage = 20;

export const jfetch = (url: string, options?: RequestInit) => {
	if (url.includes("?")) url += "&format=json";
	else url += "?format=json";

	const token = get(tokenStore);

	return fetch(`${jnovelURL}${apiURL}${url}`, {
		...options,
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			...options?.headers,
		},
	});
};

export const jembed = (url: string) => {
	const token = get(tokenStore);

	return fetch(`${jnovelURL}${embedURL}${url}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});
};

export const getPartContent = async (id: string): Promise<String> => {
	console.log(id);
	const res = await jembed(`/${id}/data.xhtml`);
	if (res.ok) {
		const data = await res.text();
		return data;
	}

	notificationStore.set({
		type: "error",
		message:
			"Error fetching part data. Error code: " +
			res.status +
			" " +
			res.statusText,
	});

	return "Error fetching part. Try again later. If the problem persists, please contact the developer.<br><br>Remember, manga parts are not supported!!";
};
