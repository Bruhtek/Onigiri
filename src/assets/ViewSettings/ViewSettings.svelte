<script lang="ts">
	import Checkbox from "../Settings/Components/Checkbox.svelte";
	import Numerical from "../Settings/Components/Numerical.svelte";
	import SettingsButton from "../Settings/Items/SettingsButton.svelte";
	import SettingsModal from "../Settings/Items/SettingsModal.svelte";

	export let toggleSettings = () => {};
</script>

<SettingsModal position="bottom" {toggleSettings}>
	<Numerical storeType="view" settingName="columnCount" step={1} min={1} max={10}>
		Column Count
	</Numerical>
	<Checkbox storeType="view" settingName="highCoverQuality">
		High Quality Cover
	</Checkbox>
	<Checkbox storeType="view" settingName="hideMangas">
		Hide Mangas
	</Checkbox>
</SettingsModal>