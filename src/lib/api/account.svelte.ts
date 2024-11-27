import { createPersistentStore } from '$lib/helpers/persistentStore.svelte.js';
import { jfetch } from '$lib/api/jnovel.svelte';
import { z } from 'zod';
import { addSeconds } from 'date-fns';
import releasesStore from '$lib/api/releases.svelte';
import { createStore } from '$lib/helpers/store.svelte';
import { sendBroadcastMessage } from '$lib/lifecycle/serviceWorker';
import type { DynamicCacheMessage } from '$lib/types/broadcastMessageTypes';

type AccountData = {
	token: string | null;
	expiration: Date | null;
};

const accountStore = await createPersistentStore<AccountData>('account', {
	token: null,
	expiration: null,
});

// #region Login
export const loggedIn = () => {
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

	// clear releases, to get parts progress when we next request them
	await beforeLogin();

	await accountStore.set({
		token: res.id,
		expiration: expires,
	});

	await afterLogin();
};

const beforeLogin = async () => {
	releasesStore.reset();
};
const afterLogin = async () => {
	await getAccountInfo();
};

/// Returns:
/// - true for success
/// - false for failure, with second item as error string
export const login = async (
	username: string,
	password: string,
): Promise<[true, null] | [false, string]> => {
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
		});

		if (res.status !== 201) {
			if (res.status === 401) {
				return [false, 'Invalid username or password'];
			} else {
				return [
					false,
					`Unspecified error while logging in - status code ${res.status}. Contact the developer`,
				];
			}
		}

		const json = await res.json();
		await _setToken(json);

		return [true, null];
	} catch (error) {
		console.error(error);
		return [false, 'Unspecified error while logging in. Contact the developer'];
	}
};

// #region OTP

export const OTPResponseScheme = z.object({
	otp: z.string(),
	proof: z.string(),
	ttl: z.number(),
});
export type OTPResponse = z.infer<typeof OTPResponseScheme>;

/// Returns:
/// - true for success
/// - false for failure, with second item as error string
export const otp_generate = async (): Promise<[OTPResponse, null] | [null, string]> => {
	try {
		const res = await jfetch('/auth/otp4app/generate');

		if (res.status !== 201) {
			if (res.status === 429) {
				return [null, "You're too fast! Wait a moment before doing that again"];
			}
			return [
				null,
				`Unspecified error while requesting OTP Code - status code ${res.status}. Contact the developer`,
			];
		}

		const json = await res.json();
		const otpData = OTPResponseScheme.parse(json);

		return [otpData, null];
	} catch (error) {
		console.error(error);
		return [null, 'Unspecified error while logging in. Contact the developer'];
	}
};

// in this one, we silently ignore errors, since the deletion doesn't really matter - it expires in 10 minutes anyway
export const otp_delete = async (otp: OTPResponse) => {
	try {
		await jfetch(`/auth/otp4app/check/${otp.otp}/${otp.proof}`, {
			method: 'DELETE',
		});
	} catch (error) {
		console.error(error);
	}
};

export enum OTPResponseStates {
	NoChanges,
	LoggedIn,
	Errored,
}

export const otp_check = async (
	otp: OTPResponse,
): Promise<
	| [OTPResponseStates.LoggedIn | OTPResponseStates.NoChanges, null]
	| [OTPResponseStates.Errored, string]
> => {
	try {
		const res = await jfetch(`/auth/otp4app/check/${otp.otp}/${otp.proof}`);

		if (res.status === 204) {
			return [OTPResponseStates.NoChanges, null];
		}

		if (res.status === 200) {
			const json = await res.json();
			await _setToken(json);

			return [OTPResponseStates.LoggedIn, null];
		}

		if (res.status === 429) {
			return [
				OTPResponseStates.Errored,
				"You're too fast! Wait a moment before doing that again",
			];
		}

		return [
			OTPResponseStates.Errored,
			`Unspecified error while checking OTP code - status code ${res.status}. Contact the developer`,
		];
	} catch (error) {
		console.error(error);
		return [
			OTPResponseStates.Errored,
			'Unspecified error while logging in. Contact the developer',
		];
	}
};

// #region AccountInfo

export const accountInfoSchema = z
	.object({
		id: z.string(),
		email: z.string(),
		username: z.string(),
		country: z.string(),
		created: z.string().datetime(),
		level: z.string(),
		subscriptionStatus: z.string(),
		emailHash: z.string().optional(),
	})
	.optional();

export const accountInfoStore = await createPersistentStore<z.infer<typeof accountInfoSchema>>(
	'accountInfo',
	undefined,
);

export const getAccountInfo = async (): Promise<void> => {
	if (!loggedIn()) {
		return;
	}

	const res = await jfetch('/me');

	if (!res.ok) {
		console.error('Error getting account info - ', res.status);
		return;
	}

	try {
		const json = await res.json();
		const schema = accountInfoSchema.parse(json);

		if (!schema) {
			return;
		}

		schema.emailHash = await calculateEmailHash(schema.email);
		await accountInfoStore.set(schema);

		// if we can, cache the gravatar for the user email, so that we don't load it each time
		sendBroadcastMessage({
			type: 'DynamicCacheMessage',
			action: 'add',
			requestInfo: `https://gravatar.com/avatar/${schema.emailHash}`,
		} as DynamicCacheMessage);
	} catch (err) {
		console.error(err);
		return;
	}
};

const calculateEmailHash = async (email: string): Promise<string> => {
	const utf8 = new TextEncoder().encode(email);

	if (!crypto.subtle) {
		return '';
	}

	return await crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');
	});
};

export default accountStore;
