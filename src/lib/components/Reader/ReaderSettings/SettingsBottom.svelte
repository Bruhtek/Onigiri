<script lang="ts">
	import Select from '$lib/components/Inputs/Select.svelte';
	import PrefReader, {
		readerPreferencesDefaults,
		FontFamily,
		TapZone,
	} from '$lib/stores/preferences/Reader.svelte';
	import Number from '$lib/components/Inputs/Number.svelte';
	import Checkbox from '$lib/components/Inputs/Checkbox.svelte';

	interface Props {
		toggleZones: (state: boolean) => void;
	}

	let { toggleZones }: Props = $props();

	const availableFonts = [FontFamily.Bookerly, FontFamily.AmazonEmber, FontFamily.LibreBaskerville, FontFamily.Helvetica, FontFamily.Jost];
	const readableFontNames = availableFonts.map((v) => PrefReader.mapFontFamily(v).name);
</script>

<div class="container">
	<Select
		title="Tap Zones"
		options={[TapZone.Edges, TapZone.LShaped, TapZone.Kindle, TapZone.OnlyTop]}
		readableOptions={[TapZone.Edges, TapZone.LShaped, TapZone.Kindle, TapZone.OnlyTop]}
		current={PrefReader.v.tapZone}
		onSelect={(val: TapZone) => {
			PrefReader.patch({tapZone: val});
			toggleZones(true);
		}}
	/>
	<Checkbox
		title="Show tap zones when entering the reader"
		defaultValue={readerPreferencesDefaults.alwaysShowTapZones}
		current={PrefReader.v.alwaysShowTapZones}
		onChange={(val) => PrefReader.patch({alwaysShowTapZones: val})}
	/>
	<hr>
	<Select
		title="Font Family"
		options={availableFonts}
		readableOptions={readableFontNames}
		current={PrefReader.v.fontFamily}
		onSelect={(val: FontFamily) => {
			PrefReader.patch({fontFamily: val});
		}}
	>
		{#snippet displaySnippet(value: FontFamily)}
			<span style={"font-family: " + PrefReader.mapFontFamily(value).css}>
				{PrefReader.mapFontFamily(value).name}
			</span>
		{/snippet}
	</Select>
	<Number
		title="Font Size"
		min={1}
		max={100}
		defaultValue={readerPreferencesDefaults.fontSize}
		current={PrefReader.v.fontSize}
		onChange={(val) => PrefReader.patch({fontSize: val})}
	/>
	<Checkbox
		title="Justify Text"
		defaultValue={readerPreferencesDefaults.justifyText}
		current={PrefReader.v.justifyText}
		onChange={(val) => PrefReader.patch({justifyText: val})}
	/>
	<hr>
	<Number
		title="Page Margins"
		min={0}
		max={100}
		step={2}
		defaultValue={readerPreferencesDefaults.pageMargins}
		current={PrefReader.v.pageMargins}
		onChange={(val) => PrefReader.patch({pageMargins: val})}
	/>
	<Number
		title="Line Spacing"
		min={0.9}
		max={2}
		step={0.05}
		defaultValue={readerPreferencesDefaults.lineSpacing}
		current={PrefReader.v.lineSpacing}
		onChange={(val) => PrefReader.patch({lineSpacing: val})}
	/>
	<Number
		title="Paragraph Spacing"
		min={0}
		max={80}
		step={2}
		defaultValue={readerPreferencesDefaults.paragraphSpacing}
		current={PrefReader.v.paragraphSpacing}
		onChange={(val) => PrefReader.patch({paragraphSpacing: val})}
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
