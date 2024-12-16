import { z } from 'zod';
import Part, { PartScheme } from '$lib/types/Part';
import { PaginationScheme } from '$lib/api/schemas';
import { createArrayStore } from '$lib/helpers/store.svelte';
import { pageProperties } from '$lib/stores/pageProperties.svelte';
import JAccount from '$lib/api/JAccount.svelte';
import releasesPreferencesStore from '$lib/stores/releasesPreferencesStore.svelte';
import { jfetch } from '$lib/api/JNovel.svelte';
import notificationStore from '$lib/stores/notificationStore.svelte';

class ReleasesClass {
	private _store: ReturnType<typeof createArrayStore<Part>>;
	private _loading = false;

	public get loading() {
		return this._loading;
	}

	public set loading(value: boolean) {
		this._loading = value;
	}

	public get releases() {
		return this._store.value;
	}

	constructor() {
		this._store = createArrayStore<Part>([]);
	}

	public clear = () => {
		this._store.reset();
		pageProperties.patch({ lastPage: false });
	};

	public fetchMoreReleases = async (limit: number = 200) => {
		if (pageProperties.value.lastPage || this._loading) {
			return;
		}

		this._loading = true;
		const currentNum = this.releases.length;
		let query = `?limit=${limit}&skip=${currentNum}&type=1`; // type 1 - only Novels
		if (JAccount.loggedIn && releasesPreferencesStore.value.favoritesOnly) {
			query += '&only_follows=true';
		}

		try {
			const res = await jfetch(`/releases${query}`);
			const json = await res.json();
			console.log(json);
			const data = ReleasesScheme.parse(json);

			const newParts = data.parts.map((part) => new Part(part));

			this._store.update((parts) => [...parts, ...newParts]);

			if (data.pagination.lastPage) {
				notificationStore.info('You have reached the last page');
				pageProperties.patch({ lastPage: true });
			}

			notificationStore.success(`Loaded ${limit} more releases`, 2000);
		} catch (e) {
			console.log(e);
			if (e instanceof TypeError) {
				notificationStore.error('Error loading more releases: no internet!');
			} else {
				notificationStore.error(`Error loading more releases: ${e}`);
			}
		} finally {
			this._loading = false;
		}
	};

	public updateReleaseProgress = (id: string, progress: number) => {
		const index = this.releases.findIndex((v) => v.id === id);
		if (index === -1) {
			return;
		}
		const part = this.releases[index];
		part.progress = progress;

		this._store.patchAtIndex(part, index);
	};
}

const Releases = new ReleasesClass();
export default Releases;

const ReleasesScheme = z.object({
	parts: z.array(PartScheme),
	pagination: PaginationScheme,
});
