import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
const devconfig = defineConfig({
	server: {
		// https: true,
		port: 443,
	},
	plugins: [
		svelte({
			onwarn: (warning, handler) => {
				// e.g. don't warn on a11y-autofocus
				if (warning.code.startsWith("a11y-")) return;

				// let Rollup handle all other warnings normally
				handler(warning);
			},
		}),
		mkcert({
			hosts: ["localhost", "dev.j-novel.club"],
		}),
	],
});

const prodconfig = defineConfig({
	plugins: [
		svelte(),
	]
});

export default process.env.DEPLOY === "true" ? prodconfig : devconfig;
