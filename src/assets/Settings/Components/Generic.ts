import { readerSettings, viewSettings } from "../../../lib/stores/settingsStore";

const storeTypes = {
	"reader": readerSettings,
	"view": viewSettings,
};

export type StoreType = keyof typeof storeTypes;
export type Store = typeof storeTypes[StoreType];

export const getStore = (storeType: StoreType): Store => {
	return storeTypes[storeType];
}