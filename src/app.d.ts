import 'unplugin-icons/types/svelte';
import 'vitest-fetch-mock';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			selected?: number;
		}

		// interface Platform {}
	}
	declare const __CHANGELOG_STRING__: string;
}

export {};
