<script lang="ts">
	import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon, SettingsIcon, StarIcon } from "svelte-feather-icons";
	import SettingsModal from "../../ViewSettings/SettingsModal.svelte";
	import {
		lastSeriesPage,
		onlyCatchupSeries,
		onlyFollowedSeries,
		series,
		seriesPage
	} from "../../../lib/stores/seriesStore";
	import { get } from "svelte/store";

	export let page: number = 0;
	export let pageCount: number = 0;
	export let nextPage: () => void;
	export let prevPage: () => void;
	const toggleSettings = () => {
		settintsOpen = !settintsOpen;
	}

	const toggleOnlyFollowed = () => {
		if(get(series).length === 0) return;
		seriesPage.set(0)
		series.set([])
		lastSeriesPage.set(false)
		onlyFollowedSeries.set(!$onlyFollowedSeries)
	}
	const toggleOnlyCatchups = () => {
		if(get(series).length === 0) return;
		seriesPage.set(0)
		series.set([])
		lastSeriesPage.set(false)
		onlyCatchupSeries.set(!$onlyCatchupSeries)
	}

	let settintsOpen = false;
</script>

{#if settintsOpen}
	<SettingsModal {toggleSettings} />
{:else}
	<div class="page-control">
		<div class="icon-button" on:click={prevPage}>
			<ArrowLeftIcon on:click={prevPage} />
		</div>
		<div class="icon-button" on:click={toggleSettings}>
			<SettingsIcon />
		</div>
		<p>Page {page + 1}/{pageCount}</p>
		<div class="group">
			<div class="icon-button" on:click={toggleOnlyFollowed}>
				<StarIcon class={$onlyFollowedSeries ? "filled" : ""} />
			</div>
			<div class="icon-button" on:click={toggleOnlyCatchups}>
				<CalendarIcon class={$onlyCatchupSeries ? "filled" : ""} />
			</div>
		</div>
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

	.group {
		display: flex;
		gap: 1rem;
	}
</style>