import { createPersistentStore } from '$lib/helpers/persistentStore.svelte';

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

export const enum TapAction {
	Next = 'N',
	NextText = 'NT',
	Previous = 'P',
	PreviousText = 'PT',
	Settings = 'S',
	SettingsText = 'ST',
	Nothing = 'X',
	NothingText = 'XT',
}

export const mapTapZones = (
	zone: TapZone,
): [
	[TapAction, TapAction, TapAction],
	[TapAction, TapAction, TapAction],
	[TapAction, TapAction, TapAction],
] => {
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

export enum FontFamily {
	AmazonEmber,
	Bookerly,
	LibreBaskerville,
	Helvetica,
	Jost,
}

export const mapFontFamily = (ff: FontFamily) => {
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

type ReaderPreferencesData = {
	pageMargins: number;
	fontSize: number;
	tapZone: TapZone;
	zonesFirstShow: boolean; // show tap zones when someone opens the reader for the first time
	fontFamily: FontFamily;
};

const readerPreferencesStore = await createPersistentStore<ReaderPreferencesData>(
	'readerPreferences',
	{
		pageMargins: 12,
		fontSize: 18,
		tapZone: TapZone.Edges,
		zonesFirstShow: true,
		fontFamily: FontFamily.Bookerly,
	},
);

export default readerPreferencesStore;
