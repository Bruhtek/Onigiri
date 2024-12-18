import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';
import { addSeconds } from 'date-fns';
import Releases from '$lib/api/Releases.svelte';
import { jfetch } from '$lib/api/JNovel.svelte';
import type { Result } from '$lib/types/HelperTypes';
import { z } from 'zod';
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
const accountInfoStore = await createPersistentStore<z.infer<typeof AccountInfoSchema> | undefined>(
	'accountInfo',
	undefined,
);

class JAccountClass {
	private _account: typeof accountStore;
	private _accountInfo: typeof accountInfoStore;

	public get loggedIn() {
		return this._account.value.token !== null;
	}

	public get accountInfo() {
		if (!this.loggedIn) {
			return undefined;
		}
		return this._accountInfo.value;
	}

	public get token() {
		return this._account.value.token;
	}

	public set token(value: string | null) {
		this._account.patch({ token: value });
	}

	constructor() {
		this._account = accountStore;
		this._accountInfo = accountInfoStore;
	}

	private async _setToken(responseObject: unknown) {
		const res = LoginResponseScheme.parse(responseObject);

		const created = new Date(res.created);
		const expires = addSeconds(created, parseInt(res.ttl));

		// clear releases, to get parts progress when we next request them
		await this._beforeLogin();

		await accountStore.set({
			token: res.id,
			expiration: expires,
		});

		await this._afterLogin();
	}

	private _beforeLogin = async () => {
		Releases.clear();
	};
	private _afterLogin = async () => {
		await this.fetchAccountInfo();
	};

	public login = async (username: string, password: string): Promise<Result<undefined>> => {
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
					return { error: 'Invalid username or password' };
				} else {
					console.error(res);
					return {
						error: `Unspecified error while logging in - status code ${res.status}. Contact the developer`,
					};
				}
			}

			const json = await res.json();
			await this._setToken(json);

			return { error: false, data: undefined };
		} catch (error) {
			console.error(error);
			return { error: 'Unspecified error while logging in. Contact the developer' };
		}
	};

	public logout = async () => {
		await this._account.reset();
	};

	public otp_generate = async (): Promise<Result<OTPResponse>> => {
		try {
			const res = await jfetch('/auth/otp4app/generate');

			if (res.status !== 201) {
				if (res.status === 429) {
					return { error: "You're too fast! Wait a moment before doing that again" };
				}
				console.error(res);
				return {
					error: `Unspecified error while requesting OTP Code - status code ${res.status}. Contact the developer`,
				};
			}

			const json = await res.json();
			const otpData = OTPResponseScheme.parse(json);

			return { error: false, data: otpData };
		} catch (error) {
			console.error(error);
			return { error: 'Unspecified error while logging in. Contact the developer' };
		}
	};

	public otp_delete = async (otp: OTPResponse) => {
		try {
			await jfetch(`/auth/otp4app/check/${otp.otp}/${otp.proof}`, {
				method: 'DELETE',
			});
		} catch (error) {
			// we silently ignore errors, since the deletion doesn't really matter
			// the otp token expires in 10 minutes anyway
			console.error(error);
		}
	};

	public otp_check = async (otp: OTPResponse): Promise<Result<OTPResponseState>> => {
		try {
			const res = await jfetch(`/auth/otp4app/check/${otp.otp}/${otp.proof}`);

			if (res.status === 204) {
				return { error: false, data: OTPResponseState.NoChanges };
			}

			if (res.status === 200) {
				const json = await res.json();
				await this._setToken(json);

				return { error: false, data: OTPResponseState.LoggedIn };
			}

			if (res.status === 429) {
				return {
					error: "You're too fast! Wait a moment before doing that again",
				};
			}

			console.error(res);
			return {
				error: `Unspecified error while checking OTP code - status code ${res.status}. Contact the developer`,
			};
		} catch (error) {
			console.error(error);
			return {
				error: 'Unspecified error while logging in. Contact the developer',
			};
		}
	};

	private _calculateEmailHash = async (email: string): Promise<string> => {
		const utf8 = new TextEncoder().encode(email);

		if (!crypto.subtle) {
			return '';
		}

		return await crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			return hashArray.map((bytes) => bytes.toString(16).padStart(2, '0')).join('');
		});
	};

	public fetchAccountInfo = async (): Promise<void> => {
		if (!this.loggedIn) {
			return;
		}

		const res = await jfetch('/me');

		if (!res.ok) {
			console.error('Error getting account info - ', res.status);
			return;
		}

		try {
			const json = await res.json();
			const schema = AccountInfoSchema.parse(json);

			if (!schema) {
				return;
			}

			schema.emailHash = await this._calculateEmailHash(schema.email);
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
}

const JAccount = new JAccountClass();
export default JAccount;

export const LoginResponseScheme = z.object({
	id: z.string(),
	ttl: z.string(),
	created: z.string().datetime(),
});

export const OTPResponseScheme = z.object({
	otp: z.string(),
	proof: z.string(),
	ttl: z.number(),
});
export type OTPResponse = z.infer<typeof OTPResponseScheme>;

export enum OTPResponseState {
	NoChanges,
	LoggedIn,
}

export const AccountInfoSchema = z.object({
	id: z.string(),
	email: z.string(),
	username: z.string(),
	country: z.string(),
	created: z.string().datetime(),
	level: z.string(),
	subscriptionStatus: z.string(),
	emailHash: z.string().optional(),
});
