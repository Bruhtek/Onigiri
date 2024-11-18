<script lang="ts">
	import Select from '$lib/components/Inputs/Select.svelte';
	import readerPreferencesStore, {
		defaultReaderPreferencesData,
		FontFamily,
		mapFontFamily,
		TapZone,
	} from '$lib/stores/readerPreferencesStore.svelte';
	import Number from '$lib/components/Inputs/Number.svelte';
	import Checkbox from '$lib/components/Inputs/Checkbox.svelte';
	import HrWithText from '$lib/components/Utils/HrWithText.svelte';

	interface Props {
		toggleZones: (state: boolean) => void;
	}

	let { toggleZones }: Props = $props();

	const availableFonts = [FontFamily.Bookerly, FontFamily.AmazonEmber, FontFamily.LibreBaskerville, FontFamily.Helvetica, FontFamily.Jost];
	const readableFontNames = availableFonts.map((v) => mapFontFamily(v).name);
</script>

<div class="container">
	<Select
		title="Tap Zones"
		options={[TapZone.Edges, TapZone.LShaped, TapZone.Kindle, TapZone.OnlyTop]}
		readableOptions={[TapZone.Edges, TapZone.LShaped, TapZone.Kindle, TapZone.OnlyTop]}
		current={readerPreferencesStore.value.tapZone}
		onSelect={(val: TapZone) => {
			readerPreferencesStore.patch({tapZone: val});
			toggleZones(true);
		}}
	/>
	<Checkbox
		title="Show tap zones when entering the reader"
		defaultValue={defaultReaderPreferencesData.alwaysShowTapZones}
		current={readerPreferencesStore.value.alwaysShowTapZones}
		onChange={(val) => readerPreferencesStore.patch({alwaysShowTapZones: val})}
	/>
	<hr>
	<Select
		title="Font Family"
		options={availableFonts}
		readableOptions={readableFontNames}
		current={readerPreferencesStore.value.fontFamily}
		onSelect={(val: FontFamily) => {
			readerPreferencesStore.patch({fontFamily: val});
		}}
	>
		{#snippet displaySnippet(value: FontFamily)}
			<span style={"font-family: " + mapFontFamily(value).css}>
				{mapFontFamily(value).name}
			</span>
		{/snippet}
	</Select>
	<Number
		title="Font Size"
		min={1}
		max={100}
		defaultValue={defaultReaderPreferencesData.fontSize}
		current={readerPreferencesStore.value.fontSize}
		onChange={(val) => readerPreferencesStore.patch({fontSize: val})}
	/>
	<Checkbox
		title="Justify Text"
		defaultValue={defaultReaderPreferencesData.justifyText}
		current={readerPreferencesStore.value.justifyText}
		onChange={(val) => readerPreferencesStore.patch({justifyText: val})}
	/>
	<hr>
	<Number
		title="Page Margins"
		min={0}
		max={100}
		step={2}
		defaultValue={defaultReaderPreferencesData.pageMargins}
		current={readerPreferencesStore.value.pageMargins}
		onChange={(val) => readerPreferencesStore.patch({pageMargins: val})}
	/>
	<Number
		title="Line Spacing"
		min={0.9}
		max={2}
		step={0.05}
		defaultValue={defaultReaderPreferencesData.lineSpacing}
		current={readerPreferencesStore.value.lineSpacing}
		onChange={(val) => readerPreferencesStore.patch({lineSpacing: val})}
	/>
	<Number
		title="Paragraph Spacing"
		min={0}
		max={80}
		step={2}
		defaultValue={defaultReaderPreferencesData.paragraphSpacing}
		current={readerPreferencesStore.value.paragraphSpacing}
		onChange={(val) => readerPreferencesStore.patch({paragraphSpacing: val})}
	/>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1rem;
		width: 100%;
	}
</style>
