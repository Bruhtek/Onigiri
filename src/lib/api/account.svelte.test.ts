// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// import accountStore, {
// 	loggedIn,
// 	login,
// 	otp_generate,
// 	otp_check,
// 	getAccountInfo,
// 	OTPResponseStates,
// 	accountInfoStore,
// } from './account.svelte';
// import { jfetch } from '$lib/api/jnovel.old.svelte.js';
// import releasesStore from '$lib/api/releases.svelte';
//
// vi.mock('localforage', () => ({
// 	default: {
// 		setDriver: vi.fn(),
// 		getItem: vi.fn().mockResolvedValue({ token: 'TEST_TOKEN', expiration: new Date() }), // Custom mock for this file
// 		setItem: vi.fn(),
// 	},
// }));
//
// vi.mock('$lib/api/jnovel.svelte', () => ({
// 	jfetch: vi.fn(),
// }));
//
// vi.mock('$lib/api/releases.svelte', () => ({
// 	default: {
// 		reset: vi.fn(),
// 	},
// }));
//
// describe('account.svelte.ts', () => {
// 	beforeEach(() => {
// 		accountStore.set({ token: null, expiration: null });
// 		vi.clearAllMocks();
// 	});
//
// 	afterEach(() => {
// 		vi.resetAllMocks();
// 	});
//
// 	describe('loggedIn', () => {
// 		it('should return false when token is null', () => {
// 			expect(loggedIn()).toBe(false);
// 		});
//
// 		it('should return true when token is not null', () => {
// 			accountStore.set({ token: 'TEST_TOKEN', expiration: null });
// 			expect(loggedIn()).toBe(true);
// 		});
// 	});
//
// 	describe('login', () => {
// 		it('should handle successful login', async () => {
// 			const mockResponse = {
// 				id: 'TEST_TOKEN',
// 				ttl: '3600',
// 				created: new Date().toISOString(),
// 			};
//
// 			// @ts-expect-error - Mocking jfetch
// 			vi.mocked(jfetch).mockResolvedValue({
// 				status: 201,
// 				ok: true,
// 				json: () => Promise.resolve(mockResponse),
// 			});
//
// 			const result = await login('user', 'pass');
// 			expect(result).toEqual([true, null]);
// 			expect(accountStore.value.token).toBe('TEST_TOKEN');
// 			expect(releasesStore.reset).toHaveBeenCalled();
// 		});
//
// 		it('should return error on invalid credentials', async () => {
// 			// @ts-expect-error - Mocking jfetch
// 			vi.mocked(jfetch).mockResolvedValueOnce({ status: 401 });
//
// 			const result = await login('user', 'wrongpass');
// 			expect(result).toEqual([false, 'Invalid username or password']);
// 		});
//
// 		it('should handle unspecified errors', async () => {
// 			vi.mocked(jfetch).mockRejectedValueOnce(new Error('Network Error'));
//
// 			const result = await login('user', 'pass');
// 			expect(result).toEqual([
// 				false,
// 				'Unspecified error while logging in. Contact the developer',
// 			]);
// 		});
// 	});
//
// 	describe('otp_generate', () => {
// 		it('should handle successful otp generation', async () => {
// 			const mockResponse = { otp: '123456', proof: 'abc123', ttl: 300 };
//
// 			// @ts-expect-error - Mocking jfetch
// 			vi.mocked(jfetch).mockResolvedValueOnce({
// 				status: 201,
// 				json: () => Promise.resolve(mockResponse),
// 			});
//
// 			const result = await otp_generate();
// 			expect(result).toEqual([mockResponse, null]);
// 		});
//
// 		it('should return error for too many requests', async () => {
// 			// @ts-expect-error - Mocking jfetch
// 			vi.mocked(jfetch).mockResolvedValueOnce({ status: 429 });
//
// 			const result = await otp_generate();
// 			expect(result).toEqual([
// 				null,
// 				"You're too fast! Wait a moment before doing that again",
// 			]);
// 		});
// 	});
//
// 	describe('otp_check', () => {
// 		const mockOTP = { otp: '123456', proof: 'abc123', ttl: 300 };
//
// 		it('should handle successful login via otp', async () => {
// 			const mockResponse = {
// 				id: 'NEW_TOKEN',
// 				ttl: '3600',
// 				created: new Date().toISOString(),
// 			};
//
// 			// @ts-expect-error - Mocking jfetch
// 			vi.mocked(jfetch).mockResolvedValue({
// 				status: 200,
// 				json: () => Promise.resolve(mockResponse),
// 			});
//
// 			const result = await otp_check(mockOTP);
// 			expect(result).toEqual([OTPResponseStates.LoggedIn, null]);
// 			expect(accountStore.value.token).toBe('NEW_TOKEN');
// 		});
//
// 		it('should handle no changes via otp', async () => {
// 			// @ts-expect-error - Mocking jfetch
// 			vi.mocked(jfetch).mockResolvedValueOnce({ status: 204 });
//
// 			const result = await otp_check(mockOTP);
// 			expect(result).toEqual([OTPResponseStates.NoChanges, null]);
// 		});
//
// 		it('should handle otp errors', async () => {
// 			// @ts-expect-error - Mocking jfetch
// 			vi.mocked(jfetch).mockResolvedValueOnce({ status: 429 });
//
// 			const result = await otp_check(mockOTP);
// 			expect(result).toEqual([
// 				OTPResponseStates.Errored,
// 				"You're too fast! Wait a moment before doing that again",
// 			]);
// 		});
// 	});
//
// 	describe('getAccountInfo', () => {
// 		it('should fetch and set account info when logged in', async () => {
// 			accountStore.set({ token: 'TEST_TOKEN', expiration: null });
// 			const mockResponse = {
// 				id: 'user1',
// 				email: 'user1@example.com',
// 				username: 'user1',
// 				country: 'us',
// 				created: new Date().toISOString(),
// 				level: 'premium',
// 				subscriptionStatus: 'active',
// 				emailHash: 'abc123',
// 			};
//
// 			// @ts-expect-error - Mocking jfetch
// 			vi.mocked(jfetch).mockResolvedValue({
// 				ok: true,
// 				json: () => Promise.resolve(mockResponse),
// 			});
//
// 			vi.spyOn(accountInfoStore, 'set');
// 			await getAccountInfo();
//
// 			expect(accountInfoStore.set).toHaveBeenCalledWith({
// 				...mockResponse,
// 				emailHash: expect.any(String),
// 			});
// 		});
//
// 		it('should handle fetch error gracefully', async () => {
// 			accountStore.value.token = 'TEST_TOKEN';
// 			// @ts-expect-error - Mocking jfetch
// 			vi.mocked(jfetch).mockResolvedValueOnce({ ok: false, status: 500 });
//
// 			await getAccountInfo();
// 			expect(accountInfoStore.set).not.toHaveBeenCalled();
// 		});
// 	});
// });
