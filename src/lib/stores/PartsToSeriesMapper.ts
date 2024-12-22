import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';
import type SerieAggregate from '$lib/types/SerieAggregate';

// in the form of { 'series_id': 'PARTID1_PARTID2...' }
// since there will be a lot of parts and way fewer series
// the better option is probably to loop through keys looking for part
// as that way the object won't be too big
type PartsToSeriesMapperType = {
	[key: string]: string;
};
const partsMapper = await createPersistentStore<PartsToSeriesMapperType>('pref-releases', {});

class PartsMapperClass {
	private _store = partsMapper;

	constructor() {}

	public partToSeries(partId: string): string | null {
		for (const [seriesId, parts] of Object.entries(this._store.value)) {
			if (parts.includes(partId)) {
				return seriesId;
			}
		}
		return null;
	}

	public updateSeriesData(serieAggregate: SerieAggregate) {
		const seriesId = serieAggregate.id;
		let parts = '';
		for (const volume of serieAggregate.volumes) {
			for (const part of volume.parts) {
				parts += `${part.id}_`;
			}
		}

		this._store.update((store) => {
			store[seriesId] = parts;
			return store;
		});
	}
}

const PartsMapper = new PartsMapperClass();
export default PartsMapper;
