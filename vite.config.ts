import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import mkcert from 'vite-plugin-mkcert';
import Icons from 'unplugin-icons/vite';

import { exec } from 'child_process';
import { promisify } from 'node:util';

const pexec = promisify(exec);
const __CHANGELOG_STRING__ = JSON.stringify(
	(await pexec(`git log --pretty="%C(auto)%h %s" --first-parent`)).stdout,
);

// git log --pretty='%C(auto)%h %s' --first-parent
export default defineConfig({
	define: {
		__CHANGELOG_STRING__: __CHANGELOG_STRING__,
	},
	server: {
		proxy: {},
	},
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte',
		}),
		// mkcert({
		// 	hosts: ['localhost', 'dev.j-novel.club']
		// })
	],
	build: {
		target: 'es2022',
	},
	resolve: process.env.VITEST
		? {
				conditions: ['browser'],
			}
		: undefined,
	test: {
		globals: true,
		setupFiles: './src/vitest.setup.ts',
		environment: 'jsdom',
	},
});
