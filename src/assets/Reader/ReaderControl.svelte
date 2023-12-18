<script lang="ts">
	import { ArrowLeftIcon } from "svelte-feather-icons";
	import Checkbox from "../Settings/Generics/Checkbox.svelte";
	import Numerical from "../Settings/Generics/Numerical.svelte";

	function goBack() {
		history.back();
	}
</script>

<div class="reader-controls" on:click|stopPropagation={() => {}}>
	<div class="button" on:click={goBack}>
		<ArrowLeftIcon size="2x" />
		<p class="text">Back</p>
	</div>
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
</div>

<style>
	p {
		padding-top: 3px;
	}
	.reader-controls {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 150px;
		box-sizing: content-box;
		background: #fff;
		border-bottom: 3px solid #000;
		border-top: 3px solid #000;
		z-index: 100;

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-around;
		flex-wrap: wrap;
	}
	.button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: max-content;
		padding: 15px;
		border: 2px solid #000;
		margin: 5px;
		height: 50px;
	}
</style>