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

type ReaderPreferencesData = {
	pageMargins: number;
	fontSize: number;
	tapZone: TapZone;
};

const readerPreferencesStore = await createPersistentStore<ReaderPreferencesData>(
	'readerPreferences',
	{
		pageMargins: 12,
		fontSize: 18,
		tapZone: TapZone.Edges,
	},
);

export default readerPreferencesStore;
