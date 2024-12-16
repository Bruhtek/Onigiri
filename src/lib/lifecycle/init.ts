import JAccount from '$lib/api/JAccount.svelte';

export default async function init() {
	if (JAccount.loggedIn) {
		await JAccount.fetchAccountInfo();
	}
}
