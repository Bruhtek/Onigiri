import { createPersistentStore } from '$lib/helpers/persistentStore.svelte.js';
import { jfetch } from '$lib/api/jnovel.svelte';
import { z } from 'zod';
import { addSeconds } from 'date-fns';

type AccountData = {
	token: string | null;
	expiration: Date | null;
};

const accountStore = await createPersistentStore<AccountData>('account', {
	token: null,
	expiration: null,
});

export const loggedIn = () => {
	console.log(accountStore.value);
	return accountStore.value.token !== null;
};

const loginResponseScheme = z.object({
	id: z.string(),
	ttl: z.string(),
	created: z.string().datetime(),
});

const _setToken = async (responseObject: unknown) => {
	const res = loginResponseScheme.parse(responseObject);

	const created = new Date(res.created);
	const expires = addSeconds(created, parseInt(res.ttl));

	await accountStore.set({
		token: res.id,
		expiration: expires,
	});
};

export const logIn = async (username: string, password: string): Promise<string | null> => {
	try {
		const body = {
			login: username,
			password: password,
			slim: true,
			ttl: 2592000,
		};

		const res = await jfetch('/auth/login', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (res.status !== 201) {
			if (res.status === 401) {
				return 'Invalid username or password';
			} else {
				return `Unspecified error while logging in - status code ${res.status}. Contact the developer`;
			}
		}

		const json = await res.json();
		await _setToken(json);

		return null;
	} catch (error) {
		console.error(error);
		return 'Unspecified error while logging in. Contact the developer';
	}
};

export default accountStore;
