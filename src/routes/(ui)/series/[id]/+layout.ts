import type { LayoutLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutLoad = async ({ params }) => {
	const id: string = params.id;
	if (!id) {
		redirect(307, '/series');
	}

	return {
		seriesId: id,
	};
};

export const ssr = false;
