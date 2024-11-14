<script lang="ts">
	import type { PageData } from './$types';
	import { jembed } from '$lib/api/jnovel.svelte';
	import notificationStore from '$lib/stores/notificationStore.svelte';
	import { redirect } from '@sveltejs/kit';

	let { data }: { data: PageData } = $props();

	if(data.error) {
		notificationStore.notify(data.error, {
			icon: 'error',
		});
		redirect(307, '/');
	}

	const requestData = async () => {
		const text = await jembed(data.partId);

		if(text.startsWith("Error")) {
			const errorText = text.slice(7);
			notificationStore.notify(errorText, {
				icon: 'error',
			})
			return errorText;
		}

		return text;
	}
</script>

<div>
	{#await requestData()}
		<p>Loading novel text...</p>
	{:then text}
		{@html text}
	{/await}
</div>

