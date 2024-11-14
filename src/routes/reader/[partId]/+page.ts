import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const partId: string = params.partId;
	if (!partId) {
		return {
			partId: params.partId,
			error: 'Incorrect part ID.',
		};
	}

	return {
		partId: params.partId,
		error: null,
	};
};

export const ssr = false;
