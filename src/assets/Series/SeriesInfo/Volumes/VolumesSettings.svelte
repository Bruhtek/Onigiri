<script lang="ts">
	import { ArrowLeftIcon, ArrowRightIcon, SettingsIcon } from "svelte-feather-icons";
	import VolumesSettingsModal from "./VolumesSettingsModal.svelte";

	export let page: number = 0;
	export let pageCount: number = 0;
	export let nextPage: () => void;
	export let prevPage: () => void;
	const toggleSettings = () => {
		settintsOpen = !settintsOpen;
	}

	let settintsOpen = false;
</script>

{#if settintsOpen}
	<VolumesSettingsModal {toggleSettings} />
{:else}
	<div class="page-control">
		<div class="icon-button" on:click={prevPage}>
			<ArrowLeftIcon on:click={prevPage} />
		</div>
		<div class="icon-button" on:click={toggleSettings}>
			<SettingsIcon />
		</div>
		<p>Page {page + 1}/{pageCount}</p>
		<div></div>
		<div class="icon-button" on:click={nextPage}>
			<ArrowRightIcon />
		</div>
	</div>
{/if}

<style>
	.icon-button {
		padding-top: 5px;
	}
	.icon-button :global(.filled) {
		fill: #000;
	}
	.page-control {
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		bottom: 0;
		left: 0;
		height: 5%;
		width: 100%;
		padding: 0.3rem;
		font-size: 1.2rem;
		color: #000;
		background-color: #fff;
		border: 3px solid #000;
	}
</style>