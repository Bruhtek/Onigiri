import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ params, parent }) => {
	const { seriesId } = await parent();
	const volumeId: string = params.volumeId;
	if (!volumeId) {
		redirect(307, `/series/${seriesId}`);
	}

	return {
		seriesId: seriesId,
		volumeId: volumeId,
	};
};

export const ssr = false;
export const prerender = false;
