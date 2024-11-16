<script lang="ts">
	import type { PageData } from './$types';
	import { jembed, jfetch } from '$lib/api/jnovel.svelte';
	import notificationStore from '$lib/stores/notificationStore.svelte';
	import { redirect } from '@sveltejs/kit';
	import Reader from '$lib/components/Reader/Reader.svelte';
	import { onMount } from 'svelte';
	import { parse_part_toc, type PartTocResult } from '$lib/api/parts.svelte';

	let { data }: { data: PageData } = $props();

	if (data.error) {
		notificationStore.error(data.error);
		redirect(307, '/');
	}

	let partText = $state<string>('');
	let partTocResult = $state<PartTocResult | { error: string }>({ error: 'Loading part data...' });

	const requestData = async () => {
		const res = jfetch(`/parts/${data.partId}/toc`);
		const text = await jembed(data.partId);

		if (text.startsWith('Error')) {
			const errorText = text.slice(7);
			notificationStore.error(errorText);
			history.back();
			partText = errorText;
		}

		res.then(async (response) => {
			if (response.status !== 200) {
				console.error(response);
				partTocResult = { error: 'Error getting part data' };
				return;
			}

			const json = await response.json();
			const partData = parse_part_toc(json, data.partId);

			if (partData.error !== undefined) {
				console.error(partData.error);
				partTocResult = { error: partData.error };
				return;
			}

			partTocResult = partData;
		});

		partText = text;
	};

	onMount(() => {
		requestData();
	});
</script>

{#if partText}
	<Reader content={partText} {partTocResult} />
{:else}
	<Reader content={"Loading novel data"} {partTocResult} />
{/if}
