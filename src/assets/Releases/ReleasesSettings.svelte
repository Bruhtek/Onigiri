<script lang="ts">
	import { ArrowLeftIcon, ArrowRightIcon, SettingsIcon, StarIcon } from "svelte-feather-icons";
	import { getMoreReleases, onlyFollowedReleases, releases, releasesPage } from "../../lib/stores/releasesStore";
	import SettingsModal from "./SettingsModal.svelte";
	import { get } from "svelte/store";

	export let page: number = 0;
	export let nextPage: () => void;
	export let prevPage: () => void;
	const toggleSettings = () => {
		settintsOpen = !settintsOpen;
	}

	const toggleOnlyFollowed = () => {
		if(get(releases).length === 0) return;
		releasesPage.set(0)
		releases.set([])
		onlyFollowedReleases.set(!$onlyFollowedReleases)
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
		<p>Page {page + 1}</p>
		<div class="icon-button" on:click={toggleOnlyFollowed}>
			<StarIcon class={$onlyFollowedReleases ? "filled" : ""} />
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
</style>