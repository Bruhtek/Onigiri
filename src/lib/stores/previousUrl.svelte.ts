import { createStore } from '$lib/helpers/store.svelte';

const previousUrl = createStore<string>('');

export default previousUrl;
