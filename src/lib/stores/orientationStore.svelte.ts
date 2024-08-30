import { createStore } from '$lib/helpers/store.svelte';

const isVertical = createStore<boolean>(true);

export default isVertical;
