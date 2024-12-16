import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { jfetch } from '$lib/api/JNovel.svelte';
import Releases from '$lib/api/Releases.svelte';
import JAccount, { OTPResponseState } from '$lib/api/JAccount.svelte';

vi.mock('localforage', () => ({
	default: {
		setDriver: vi.fn(),
		getItem: vi.fn().mockResolvedValue({ token: 'TEST_TOKEN', expiration: new Date() }), // Custom mock for this file
		setItem: vi.fn(),
	},
}));

vi.mock('$lib/api/JNovel.svelte', () => ({
	jfetch: vi.fn(),
}));

vi.mock('$lib/api/Releases.svelte', () => ({
	default: {
		clear: vi.fn(),
	},
}));

describe('JAccount.svelte.ts', () => {
	beforeEach(() => {
		JAccount.token = null;
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	describe('loggedIn', () => {
		it('should return false when token is null', () => {
			expect(JAccount.loggedIn).toBe(false);
		});

		it('should return true when token is not null', () => {
			JAccount.token = 'TEST_TOKEN';
			expect(JAccount.loggedIn).toBe(true);
		});
	});

	describe('login', () => {
		it('should handle successful login', async () => {
			const mockResponse = {
				id: 'TEST_TOKEN',
				ttl: '3600',
				created: new Date().toISOString(),
			};

			// @ts-expect-error - Mocking jfetch
			vi.mocked(jfetch).mockResolvedValue({
				status: 201,
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await JAccount.login('user', 'pass');
			expect(result).toMatchObject({ error: false, data: undefined });
			expect(JAccount.token).toBe('TEST_TOKEN');
			expect(Releases.clear).toHaveBeenCalled();
		});

		it('should return error on invalid credentials', async () => {
			// @ts-expect-error - Mocking jfetch
			vi.mocked(jfetch).mockResolvedValueOnce({ status: 401 });

			const result = await JAccount.login('user', 'wrongpass');
			expect(result).toMatchObject({ error: 'Invalid username or password' });
		});

		it('should handle unspecified errors', async () => {
			vi.mocked(jfetch).mockRejectedValueOnce(new Error('Network Error'));

			const result = await JAccount.login('user', 'pass');
			expect(result).toMatchObject({
				error: 'Unspecified error while logging in. Contact the developer',
			});
		});
	});

	describe('otp_generate', () => {
		it('should handle successful otp generation', async () => {
			const mockResponse = { otp: '123456', proof: 'abc123', ttl: 300 };

			// @ts-expect-error - Mocking jfetch
			vi.mocked(jfetch).mockResolvedValueOnce({
				status: 201,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await JAccount.otp_generate();
			expect(result).toMatchObject({ error: false, data: mockResponse });
		});

		it('should return error for too many requests', async () => {
			// @ts-expect-error - Mocking jfetch
			vi.mocked(jfetch).mockResolvedValueOnce({ status: 429 });

			const result = await JAccount.otp_generate();
			expect(result).toMatchObject({
				error: "You're too fast! Wait a moment before doing that again",
			});
		});
	});

	describe('otp_check', () => {
		const mockOTP = { otp: '123456', proof: 'abc123', ttl: 300 };

		it('should handle successful login via otp', async () => {
			const mockResponse = {
				id: 'NEW_TOKEN',
				ttl: '3600',
				created: new Date().toISOString(),
			};

			// @ts-expect-error - Mocking jfetch
			vi.mocked(jfetch).mockResolvedValue({
				status: 200,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await JAccount.otp_check(mockOTP);
			expect(result).toMatchObject({ error: false, data: OTPResponseState.LoggedIn });
			expect(JAccount.token).toBe('NEW_TOKEN');
		});

		it('should handle no changes via otp', async () => {
			// @ts-expect-error - Mocking jfetch
			vi.mocked(jfetch).mockResolvedValueOnce({ status: 204 });

			const result = await JAccount.otp_check(mockOTP);
			expect(result).toMatchObject({ error: false, data: OTPResponseState.NoChanges });
		});

		it('should handle otp errors', async () => {
			// @ts-expect-error - Mocking jfetch
			vi.mocked(jfetch).mockResolvedValueOnce({ status: 429 });

			const result = await JAccount.otp_check(mockOTP);
			expect(result).toMatchObject({
				error: "You're too fast! Wait a moment before doing that again",
			});
		});
	});

	describe('getAccountInfo', () => {
		it('should fetch and set account info when logged in', async () => {
			JAccount.token = 'TEST_TOKEN';
			const mockResponse = {
				id: 'user1',
				email: 'user1@example.com',
				username: 'user1',
				country: 'us',
				created: new Date().toISOString(),
				level: 'premium',
				subscriptionStatus: 'active',
			};

			// @ts-expect-error - Mocking jfetch
			vi.mocked(jfetch).mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			await JAccount.fetchAccountInfo();

			expect(JAccount.accountInfo).toMatchObject(mockResponse);
		});

		it('should handle fetch error gracefully', async () => {
			JAccount.token = 'TEST_TOKEN';
			// @ts-expect-error - Mocking jfetch
			vi.mocked(jfetch).mockResolvedValueOnce({ ok: false, status: 500 });

			await expect(JAccount.fetchAccountInfo()).resolves.not.toThrowError();
		});
	});
});
