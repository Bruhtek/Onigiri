<script lang="ts">
	import type { PageData } from './$types';
	import { jembed } from '$lib/api/jnovel.svelte';
	import notificationStore from '$lib/stores/notificationStore.svelte';
	import { redirect } from '@sveltejs/kit';
	import Reader from '$lib/components/Reader/Reader.svelte';

	let { data }: { data: PageData } = $props();

	if (data.error) {
		notificationStore.error(data.error);
		redirect(307, '/');
	}

	const requestData = async () => {
		const text = await jembed(data.partId);

		if (text.startsWith('Error')) {
			const errorText = text.slice(7);
			notificationStore.error(errorText);
			history.back();
			return errorText;
		}

		return text;
	};
</script>

{#await requestData()}
	<Reader content={"Loading novel data"} />
{:then text}
	<Reader content={text} />
{/await}

