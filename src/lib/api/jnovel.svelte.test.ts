import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import accountStore from '$lib/api/account.svelte';
import { jembed, jfetch } from '$lib/api/jnovel.svelte';

vi.mock('$lib/api/account.svelte.js', () => ({
	default: {
		value: { token: 'TEST_TOKEN' },
		reset: vi.fn(),
	},
}));

describe('jfetch', () => {
	beforeEach(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		delete (global as any).window.location;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(global as any).window.location = { href: '' };
	});

	afterEach(() => {
		vi.resetAllMocks();
		vi.clearAllMocks();
	});

	it('should add format=json to the URL', async () => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				status: 200,
				json: () => Promise.resolve({}),
			}),
		) as never;

		const res = await jfetch('/test');
		expect(global.fetch).toHaveBeenCalledWith(
			'https://labs.j-novel.club/app/v2/test?format=json',
			expect.any(Object),
		);
		expect(res.status).toBe(200);
	});

	it('should handle token expiration', async () => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				status: 410,
			}),
		) as never;

		await jfetch('/me');
		expect(accountStore.reset).toHaveBeenCalled();
		expect(window.location.href).toBe('/login?expired=true');
	});

	it('should add Authorization header when token is present', async () => {
		expect(accountStore.value.token).toBe('TEST_TOKEN');

		global.fetch = vi.fn(() =>
			Promise.resolve({
				status: 200,
				json: () => Promise.resolve({}),
			}),
		) as never;

		const res = await jfetch('/test');
		expect(global.fetch).toHaveBeenCalledWith(
			'https://labs.j-novel.club/app/v2/test?format=json',
			expect.objectContaining({
				headers: expect.objectContaining({
					Authorization: 'Bearer TEST_TOKEN',
				}),
			}),
		);
		expect(res.status).toBe(200);
	});

	it('shouldnt add Authorization header when token is not present', async () => {
		const originalToken = accountStore.value.token;
		try {
			accountStore.value.token = null;
			expect(accountStore.value.token).toBeNull();

			global.fetch = vi.fn(() =>
				Promise.resolve({
					status: 200,
					json: () => Promise.resolve({}),
				}),
			) as never;

			const res = await jfetch('/test');
			expect(global.fetch).toHaveBeenCalledWith(
				'https://labs.j-novel.club/app/v2/test?format=json',
				expect.objectContaining({
					headers: expect.not.objectContaining({
						Authorization: expect.anything(),
					}),
				}),
			);
			expect(res.status).toBe(200);
		} finally {
			accountStore.value.token = originalToken;
		}
	});
});

describe('jembed', () => {
	it('should return parsed HTML content', async () => {
		const mockHtml = '<div class="main">Test Content</div>';
		global.fetch = vi.fn(() =>
			Promise.resolve({
				status: 200,
				text: () => Promise.resolve(mockHtml),
			}),
		) as never;

		const content = await jembed('part-id');
		expect(content).toBe('Test Content');
	});

	it('should handle errors', async () => {
		global.fetch = vi.fn(() =>
			Promise.resolve({
				status: 403,
			}),
		) as never;

		const content = await jembed('part-id');
		expect(content).toBe('Error: You have to log in to read this part!');
	});
});
