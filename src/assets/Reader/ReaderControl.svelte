<script lang="ts">
	import { ArrowLeftIcon } from "svelte-feather-icons";
	import Checkbox from "../Settings/Components/Checkbox.svelte";
	import Numerical from "../Settings/Components/Numerical.svelte";
	import SettingsModal from "../Settings/Items/SettingsModal.svelte";
	import Button from "../Settings/Components/Button.svelte";
	import Selector from "../Settings/Components/Selector.svelte";
	import { fontOptions } from "../../lib/stores/settingsStore";

	function goBack() {
		history.back();
	}

</script>

<SettingsModal position="top">
	<Button action={goBack}>
		<ArrowLeftIcon size="2x" />
		<p class="text">Back</p>
	</Button>
	<Checkbox storeType="reader" settingName="justify">
		Justify Text
	</Checkbox>
	<Numerical storeType="reader" settingName="fontSize" min={10} max={30} step={1}>
		Font Size
	</Numerical>
	<Numerical storeType="reader" settingName="marginVertical" min={0} max={30} step={1}>
		Vertical Margin
	</Numerical>
	<Numerical storeType="reader" settingName="marginHorizontal" min={0} max={30} step={1}>
		Horizontal Margin
	</Numerical>
	<Selector storeType="reader" settingName="fontFamily" optionsMap={fontOptions}>
		Font
	</Selector>
</SettingsModal>

<style>
	p {
		padding-top: 3px;
	}
</style>