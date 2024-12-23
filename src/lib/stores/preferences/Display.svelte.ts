import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';
import PreferenceClass from '$lib/stores/preferences/_PreferenceClass';

export enum DisplayType {
	Grid,
	List,
}

export type DisplayPreferences = {
	volumesDisplayType: DisplayType;
	gridColumnCountVertical: number;
	gridColumnCountHorizontal: number;
	gridObjectGap: number;
	listMinObjectHeight: number;
	hdThumbnails: boolean;
};
export const displayPreferencesDefaults: DisplayPreferences = {
	volumesDisplayType: DisplayType.List,
	gridColumnCountVertical: 4,
	gridColumnCountHorizontal: 6,
	gridObjectGap: 16,
	listMinObjectHeight: 200,
	hdThumbnails: false,
};

const prefDisplay = await createPersistentStore<DisplayPreferences>(
	'pref-display',
	displayPreferencesDefaults,
);

const PrefDisplay = new PreferenceClass(prefDisplay);

export default PrefDisplay;
