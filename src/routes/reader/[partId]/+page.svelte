<script lang="ts">
	import type { PageData } from './$types';
	import { jembed, jfetch } from '$lib/api/JNovel.svelte';
	import Notifications from '$lib/stores/Notifications.svelte.js';
	import { redirect } from '@sveltejs/kit';
	import Reader from '$lib/components/Reader/Reader.svelte';
	import PrefReader from '$lib/stores/preferences/Reader.svelte';
	import ReaderZones from '$lib/components/Reader/ReaderZones.svelte';
	import { untrack } from 'svelte';
	import type { Result } from '$lib/types/HelperTypes';
	import type { PartTocResult } from '$lib/api/Parts.svelte';
	import Parts from '$lib/api/Parts.svelte';

	let { data }: { data: PageData } = $props();

	if (data.error) {
		Notifications.error(data.error);
		redirect(307, '/');
	}

	let showZones = $state<boolean>(false);
	const conditionallyShowZones = () => {
		if (PrefReader.v.alwaysShowTapZones ||
			PrefReader.v.tapZonesFirstShow
		) {
			showZones = true;
		}
	};
	conditionallyShowZones();

	const toggleZones = (state: boolean) => {
		showZones = state;
	};

	let partText = $state<string>('');
	let partTocResult = $state<Result<PartTocResult>>({ error: 'Loading part data...' });

	const requestData = async () => {
		partText = '';
		partTocResult = { error: 'Loading part data...' };

		const res = jfetch(`/parts/${data.partId}/toc`);
		const text = await jembed(data.partId);

		if (text.startsWith('Error')) {
			const errorText = text.slice(7);
			Notifications.error(errorText);
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
			const partData = Parts.parsePartToc(json, data.partId);

			if (partData.error !== false) {
				console.error(partData.error);
				partTocResult = { error: partData.error };
				return;
			}

			partTocResult = partData;
		});

		partText = text;
	};

	$effect(() => {
		// we trigger this on data.partId change
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		data.partId;
		untrack(() => requestData());
	});
</script>


{#key data.partId}
	{#if showZones}
		<ReaderZones onTap={() => {
			if(PrefReader.v.tapZonesFirstShow) {
				PrefReader.patch({tapZonesFirstShow: false});
			}
			showZones = false
		}} />
	{/if}
	{#if partText}
		<Reader content={partText} {partTocResult} loading={false} id={data.partId} {toggleZones} />
	{:else}
		<Reader content={"Loading novel data"} {partTocResult} loading={true} id={data.partId} {toggleZones} />
	{/if}
{/key}