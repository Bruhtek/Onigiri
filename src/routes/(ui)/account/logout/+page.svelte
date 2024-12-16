<script lang="ts">
	import { onMount } from 'svelte';
	import CenteredLayout from '$lib/components/Layouts/CenteredLayout.svelte';
	import { jfetch } from '$lib/api/JNovel.svelte';
	import JAccount from '$lib/api/JAccount.svelte';

	onMount(async () => {
		if (JAccount.loggedIn) {
			await jfetch('/auth/logout', {
				method: 'POST',
			});

			await JAccount.logout();
			window.location.href = '/';
		}
	});
</script>

<CenteredLayout>
	Logging you out...
</CenteredLayout>
