import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import mkcert from 'vite-plugin-mkcert';
import Icons from 'unplugin-icons/vite';

import { exec } from 'child_process';
import { promisify } from 'node:util';
import type { PluginOption } from 'vite';

const pexec = promisify(exec);
const __CHANGELOG_STRING__ = JSON.stringify(
	(await pexec(`git log --pretty="%C(auto)%h %s" --first-parent`)).stdout,
);

const plugins: PluginOption[] = [
	sveltekit(),
	Icons({
		compiler: 'svelte',
	}),
];

if (process.env.NODE_ENV === 'development') {
	plugins.push(
		mkcert({
			hosts: ['localhost', 'dev.j-novel.club'],
		}),
	);
}

// git log --pretty='%C(auto)%h %s' --first-parent
export default defineConfig({
	define: {
		__CHANGELOG_STRING__: __CHANGELOG_STRING__,
	},
	server: {
		port: process.env.NODE_ENV === 'development' ? 443 : undefined,
		proxy: {},
	},
	plugins: plugins,
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
