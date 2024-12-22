import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import Series from '$lib/api/Series.svelte';

export const load: PageLoad = async ({ params }) => {
	const id: string = params.id;
	if (!id) {
		redirect(307, '/series');
	}
	
	const seriesId = await Series.fetchSeriesIdByPartId(id);
	if (seriesId) {
		redirect(301, `/series/${seriesId}`);
	} else {
		redirect(307, '/series?not-found');
	}
};

export const ssr = false;
export const prerender = false;
