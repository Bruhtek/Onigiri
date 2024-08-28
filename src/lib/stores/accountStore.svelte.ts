import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';

type AccountData = {
	token: string|null;
	expiration: number;
};

const accountStore = await createPersistentStore<AccountData>('account', {
	token: null,
	expiration: 0,
});

export default accountStore;