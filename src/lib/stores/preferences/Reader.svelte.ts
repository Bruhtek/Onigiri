import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';
import PreferenceClass from '$lib/stores/preferences/_PreferenceClass';

// L  M  R - Left, Middle, Right
// LT MT RT - Top
// LC MC RC - Center
// LB MB RB - Bottom
export enum TapZone {
	Edges = 'Edges', // L - previous, M - settings, R - next
	LShaped = 'L-Shaped', // Top & LC - previous, MC - settings, Bottom and RC - next
	Kindle = 'Kindle Like', // Top - settings, MC MB RC RB - next, LC LB - previous
	OnlyTop = 'Only Top', // LT - previous, MT - settings, RT - next, everything else disabled
}

export enum TapAction {
	Next = 'N',
	NextText = 'NT',
	Previous = 'P',
	PreviousText = 'PT',
	Settings = 'S',
	SettingsText = 'ST',
	Nothing = 'X',
	NothingText = 'XT',
}

export enum FontFamily {
	AmazonEmber,
	Bookerly,
	LibreBaskerville,
	Helvetica,
	Jost,
}

export type ReaderPreferences = {
	pageMargins: number;
	fontSize: number;
	tapZone: TapZone;
	tapZonesFirstShow: boolean; // show tap zones when someone opens the reader for the first time
	alwaysShowTapZones: boolean;
	justifyText: boolean;
	fontFamily: FontFamily;
	lineSpacing: number;
	paragraphSpacing: number;
};

export const readerPreferencesDefaults = {
	pageMargins: 12,
	fontSize: 18,
	tapZone: TapZone.Edges,
	tapZonesFirstShow: true,
	alwaysShowTapZones: false,
	justifyText: true,
	fontFamily: FontFamily.Bookerly,
	lineSpacing: 1.2,
	paragraphSpacing: 8,
};

const prefReader = await createPersistentStore<ReaderPreferences>(
	'pref-reader',
	readerPreferencesDefaults,
);

class PrefReaderClass extends PreferenceClass<ReaderPreferences> {
	public mapFontFamily = (ff?: FontFamily) => {
		if (ff === undefined) {
			ff = this.v.fontFamily;
		}
		switch (ff) {
			case FontFamily.AmazonEmber:
				return {
					name: 'Amazon Ember',
					css: `"AmazonEmber", serif`,
				};
			case FontFamily.Bookerly:
				return {
					name: 'Bookerly',
					css: `"Bookerly", sans-serif`,
				};
			case FontFamily.LibreBaskerville:
				return {
					name: 'Libre Baskerville',
					css: `"Libre Baskerville", serif`,
				};
			case FontFamily.Helvetica:
				return {
					name: 'Helvetica',
					css: `"Helvetica", sans-serif`,
				};
			case FontFamily.Jost:
				return {
					name: 'Jost',
					css: `"Jost", sans-serif`,
				};
		}
	};

	public mapTapZones = (
		zone?: TapZone,
	): [
		[TapAction, TapAction, TapAction],
		[TapAction, TapAction, TapAction],
		[TapAction, TapAction, TapAction],
	] => {
		if (zone === undefined) {
			zone = this.v.tapZone;
		}
		switch (zone) {
			case TapZone.Edges:
				return [
					[TapAction.Previous, TapAction.Settings, TapAction.Next],
					[TapAction.PreviousText, TapAction.SettingsText, TapAction.NextText],
					[TapAction.Previous, TapAction.Settings, TapAction.Next],
				];
			case TapZone.LShaped:
				return [
					[TapAction.Previous, TapAction.PreviousText, TapAction.Previous],
					[TapAction.Previous, TapAction.SettingsText, TapAction.Next],
					[TapAction.Next, TapAction.NextText, TapAction.Next],
				];
			case TapZone.Kindle:
				return [
					[TapAction.Settings, TapAction.SettingsText, TapAction.Settings],
					[TapAction.PreviousText, TapAction.Next, TapAction.NextText],
					[TapAction.Previous, TapAction.Next, TapAction.Next],
				];
			case TapZone.OnlyTop:
				return [
					[TapAction.PreviousText, TapAction.SettingsText, TapAction.NextText],
					[TapAction.Nothing, TapAction.NothingText, TapAction.Nothing],
					[TapAction.Nothing, TapAction.Nothing, TapAction.Nothing],
				];
		}
	};
}

const PrefReader = new PrefReaderClass(prefReader);
export default PrefReader;
