import accountStore from '$lib/stores/accountStore.svelte';

const JNOVEL_URL = 'https://labs.j-novel.club';
const API_URL = `${JNOVEL_URL}/app/v2`;
const EMBED_URL = `${JNOVEL_URL}/embed`;

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

export const jembed = (url: string) => {
	return fetch(EMBED_URL + url, {
		headers: getHeaders(),
	});
};
