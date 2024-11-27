import { getAccountInfo, loggedIn } from '$lib/api/account.svelte';

export default async function init() {
	if (loggedIn()) {
		await getAccountInfo();
	}
}
