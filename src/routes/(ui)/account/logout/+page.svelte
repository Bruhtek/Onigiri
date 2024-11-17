<script lang="ts">
	import accountStore from '$lib/api/account.svelte';
	import { onMount } from 'svelte';
	import CenteredLayout from '$lib/components/Layouts/CenteredLayout.svelte';
	import { jfetch } from '$lib/api/jnovel.svelte';

	onMount(async () => {
		if (accountStore.value.token) {
			await jfetch('/auth/logout', {
				method: 'POST',
			});

			await accountStore.set({ token: null, expiration: null });
			window.location.href = '/';
		}
	});
</script>

<CenteredLayout>
	Logging you out...
</CenteredLayout>
