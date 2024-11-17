import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// import mkcert from 'vite-plugin-mkcert';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
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
});
