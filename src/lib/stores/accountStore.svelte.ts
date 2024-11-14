import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';

type AccountData = {
	token: string | null;
	expiration: Date | null;
};

const accountStore = await createPersistentStore<AccountData>('account', {
	token: null,
	expiration: null,
});

export const loggedIn = () => {
	console.log(accountStore.value);
	return accountStore.value.token !== null;
};

export default accountStore;
