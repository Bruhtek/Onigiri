import Serie, { SerieSchema } from '$lib/types/Serie';
import Volume, { VolumeSchema } from '$lib/types/Volume';
import Part, { PartSchema } from '$lib/types/Part';
import { z } from 'zod';

export type FullVolume = { volume: Volume; parts: Part[] };

class SerieAggregate extends Serie {
	volumes: FullVolume[] = [];

	constructor(api_result: unknown) {
		const json = SeriesAggregateSchema.parse(api_result);

		super(json.series);

		const volumes: FullVolume[] = [];
		for (const volData of json.volumes) {
			const v = new Volume(volData.volume);
			const parts: Part[] = [];
			for (const partData of volData.parts) {
				parts.push(new Part(partData));
			}
			volumes.push({ volume: v, parts: parts });
		}
		this.volumes = volumes;
	}
}

export const SeriesAggregateSchema = z.object({
	series: SerieSchema,
	volumes: z.array(
		z.object({
			volume: VolumeSchema,
			parts: z.array(PartSchema),
		}),
	),
});

export default SerieAggregate;
