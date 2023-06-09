import { get } from "svelte/store";
import { token as tokenStore } from "./stores/accountStore";
import type { VolumePart } from "./types/VolumePart";

// const jnovelURL = "https://labs.j-novel.club";
const jnovelURL = "https://cors.bruhtek.com/https://labs.j-novel.club";

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

export const getPartData = async (id: string): Promise<String> => {
	console.log(id);
	const res = await jembed(`/${id}/data.xhtml`);
	if (res.ok) {
		const data = await res.text();
		return data;
	}

	return "Error fetching part. Try again later.";
};
