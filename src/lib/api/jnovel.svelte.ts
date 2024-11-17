import accountStore from '$lib/api/account.svelte.js';
import preferencesStore from '$lib/stores/preferencesStore.svelte';

const JNOVEL_URL = $derived(
	preferencesStore.value.useCorsProxy
		? 'https://cors.bruhtek.com/https://labs.j-novel.club'
		: 'https://labs.j-novel.club',
);
const API_URL = $derived(`${JNOVEL_URL}/app/v2`);
const EMBED_URL = $derived(`${JNOVEL_URL}/embed/v2`);

const getHeaders = (options?: RequestInit) => {
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};
	const token = accountStore.value.token;
	if (token) headers['Authorization'] = `Bearer ${token}`;
	if (options?.headers) Object.assign(headers, options.headers);
	return headers;
};

export const jfetch = async (url: string, options?: RequestInit) => {
	if (url.includes('?')) url += '&format=json';
	else url += '?format=json';

	//403 - Requires a subscription
	//401 - Unauthorized
	//410 on Me - Token expired
	//410 on Part - Part expired

	console.log(url);
	return await fetch(API_URL + url, {
		...options,
		headers: getHeaders(options),
	});
};

export const jembed = async (partId: string): Promise<string> => {
	try {
		const res = await fetch(EMBED_URL + `/${partId}/data.xhtml`, {
			headers: getHeaders(),
		});

		// TODO: Handle expired parts as well

		if (res.status === 403) {
			return 'Error: You have to log in to read this part!';
		} else if (res.status !== 200) {
			return 'Error: Something went wrong while requesting novel data';
		}

		const text = await res.text();

		const parser = new DOMParser();
		const dom = parser.parseFromString(text, 'text/html');

		const mainDiv = dom.querySelector('div.main');
		return mainDiv?.innerHTML || 'Error: Unable to parse text from API';
	} catch (err) {
		console.error(err);
		return 'Error: Unable to retrieve novel data';
	}
};
