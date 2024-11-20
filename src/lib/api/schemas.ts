import { z } from 'zod';

export const PaginationScheme = z.object({
	lastPage: z.boolean(),
	skip: z.number().int(),
	limit: z.number().int(),
});
