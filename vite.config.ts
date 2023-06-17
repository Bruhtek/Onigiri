import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		svelte({
			onwarn: (warning, handler) => {
				// e.g. don't warn on a11y-autofocus
				if (warning.code.startsWith("a11y-")) return;

				// let Rollup handle all other warnings normally
				handler(warning);
			},
		}),
	],
	optimizeDeps: { exclude: ["svelte-navigator"] },
});
