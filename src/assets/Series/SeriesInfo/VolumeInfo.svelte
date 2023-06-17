<script lang="ts">
	import type { Volume } from "../../../lib/types/Volume";
	import type { VolumePart } from "../../../lib/types/VolumePart";
	import { link } from "svelte-navigator";

	export let volume: Volume;
	export let parts: VolumePart[];
</script>

<div class="volume">
	<img src={volume.coverURL} class="cover" alt="Cover" />
	<div class="aside">
		<div class="info">
			<h3>{volume.title}</h3>
			<p>{volume.shortDescription}</p>
		</div>
		<div class="parts">
			{#each {length: volume.totalParts ?? parts.length} as _, i}
				{#if parts[i]}
					<a class="part" style={`--progress: ${parts[i].progress}`} href="/reader/{parts[i].id}/{parts[i].progress}" use:link>
						{i}
					</a>
				{:else}
					<div class="part disabled">
						{i}
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>

<style>
	.volume {
		height: var(--item-height);
		display: flex;
		gap: 1rem;
		padding-bottom: var(--gap);
	}
	.cover {
		height: 100%;
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

	.part {
		display: inline-grid;
		border: none;
		padding: 5px;
		height: 100%;
		width: 100%;
		place-content: center;
		text-align: center;
		position: relative;
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
	.part:not(:last-child) {
		border-right: 2px solid black;
	}
</style>