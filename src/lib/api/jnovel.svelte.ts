import accountStore from '$lib/api/account.svelte.js';
import { goto } from '$app/navigation';

const JNOVEL_URL = 'https://labs.j-novel.club';

const API_URL = `${JNOVEL_URL}/app/v2`;
const EMBED_URL = `${JNOVEL_URL}/embed/v2`;

const getHeaders = (options?: RequestInit) => {
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
	};
	const token = accountStore.value.token;
	if (token) headers['Authorization'] = `Bearer ${token}`;
	if (options?.headers) Object.assign(headers, options.headers);
	return headers;
};

// #region J-Fetch
export const jfetch = async (url: string, options?: RequestInit) => {
	if (url.includes('?')) url += '&format=json';
	else url += '?format=json';

	//403 - Requires a subscription
	//401 - Unauthorized
	//410 on Me - Token expired

	console.log(url);
	const res = await fetch(API_URL + url, {
		...options,
		headers: getHeaders(options),
	});

	if (res.status !== 410) {
		return res;
	} else {
		// clear the expired token, redirect to log in with an explanatory message
		// we use window.location.href to interrupt any other control flow, to avoid any problems
		// related to incorrect 410 handling further in
		await accountStore.reset();
		window.location.href = `/login?expired=true`;
		return res;
	}
};

// #region J-Embed
export const jembed = async (partId: string): Promise<string> => {
	try {
		const res = await fetch(EMBED_URL + `/${partId}/data.xhtml`, {
			headers: getHeaders(),
		});

		// TODO: Handle expired parts as well

		if (res.status === 403) {
			return 'Error: You have to log in to read this part!';
		} else if (res.status !== 200) {
			console.error(res);
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
