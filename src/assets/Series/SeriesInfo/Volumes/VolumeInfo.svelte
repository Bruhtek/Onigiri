<script lang="ts">
	import type { Volume } from "../../../../lib/types/Volume";
	import type { VolumePart } from "../../../../lib/types/VolumePart";
	import { link } from "svelte-routing";
	import { viewSettings } from "../../../../lib/stores/settingsStore.js";

	export let volume: Volume;
	export let parts: VolumePart[];

	$: expired = !parts[0]?.expirationDate;

	$: expirationDate = () => {
		if(parts[0]?.expirationDate) {
			const date = new Date(parts[0].expirationDate);
			return date.toLocaleDateString();
		}
		return null;
	}
</script>

<div class="volume">
	<img src={$viewSettings.highCoverQuality ? volume.coverURL : volume.thumbnailURL} class="cover" alt="Cover" />
	<div class="aside" class:expired={expired}>
		<div class="info">
			<h3>
				{volume.title}
				{#if expired}
					<span class="expired">(Expired)</span>
				{/if}
			</h3>
			<p class="desc">{volume.shortDescription}</p>
			{#if !expired}
				<p class="expiration">
					Expires on {expirationDate()}
				</p>
			{/if}
		</div>
		<div class="parts">
			{#each {length: Math.max(parts.length, volume.totalParts)} as _, i}
				{#if parts[i]}
					<a class="part" class:disabled={expired} style={`--progress: ${parts[i].progress}`} href="/reader/{parts[i].id}/{parts[i].progress}" use:link>
						{i+1}
					</a>
				{:else}
					<div class="part disabled">
						{i+1}
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>

<style>
	.expired, .expiration {
		color: #333;
	}
	.volume {
		height: var(--item-height);
		display: flex;
		gap: 1rem;
		padding-bottom: var(--gap);
	}
	.cover {
		height: 100%;
		aspect-ratio: 2/3;
		border: 2px solid black;
		border-radius: 1rem;
	}
	.parts {
		height: 50px;
		border: 2px solid black;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	}
	.info {
		height: calc(100% - 50px);
		max-height: calc(100% - 50px);
		display: flex;
		flex-direction: column;
	}
	.desc {
		flex-shrink: 1;
		flex-basis: 0;
		flex-grow: 1;
		display: block;
		overflow: hidden;
	}

	.part {
		display: inline-grid;
		border: none;
		padding: 5px;
		height: 100%;
		width: 100%;
		place-content: center;
		text-align: center;
		position: relative;
		overflow: hidden;
	}
	.part::before {
		content: "";
		position: absolute;
		bottom: -1px;
		left: -1px;
		width: calc(var(--progress) * 100% + 2px);
		height: calc(100% + 2px);
		backdrop-filter: invert(1);
		z-index: 5;
	}
	.part.disabled {
		color: #666666;
	}
	.part.disabled::before {
		backdrop-filter: invert(0.7);
	}
	.part:not(:last-child) {
		border-right: 2px solid black;
	}
</style>