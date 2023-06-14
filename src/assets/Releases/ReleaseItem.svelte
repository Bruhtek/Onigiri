<script lang="ts">
	import type { VolumePart } from "../../lib/types/VolumePart.js";
	import { link } from "svelte-navigator";
	import { viewSettings } from "../../lib/stores/settingsStore";

	export let release: VolumePart;

	$: cssVars = `
	--part-progress: ${release.progress * 100}%;
	`
</script>

<a href="/reader/{release.id}" style={cssVars} use:link>
	<div class="release">
		<img
			alt="Cover"
			class="cover"
			src="{$viewSettings.highCoverQuality ? release.coverURL : release.thumbnailURL}"
		/>
		<p class="title">
			{release.title}
		</p>
		<p class="volume">
			V.{release.volumeNumber} P.{release.partNumber}
		</p>
	</div>
</a>

<style>
	a {
		text-decoration: none;
		color: black;
		display: unset;
		border: unset;
		padding: unset;
		border-radius: unset;
	}

	.release p.volume {
		position: absolute;
		top: 0.2rem;
		left: 0.2rem;
		z-index: 10;
		background-color: #fff;
		border-radius: 15px;
		padding-top: 3px;
		padding-left: 2px;
		padding-right: 2px;
		border: 2px solid black;
	}

	.release {
		height: 100%;
		width: var(--item-width);
		background-color: #aaa;
		position: relative;
		z-index: 1;
		border-radius: 15px;
	}

	.release img {
		height: 100%;
		width: 100%;
		object-fit: cover;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		border-radius: 15px;
		border: 2px solid black;

	}

	.release p.title {
		position: absolute;
		bottom: 0;
		z-index: 10;
		background-color: rgba(255, 255, 255, 1);

		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		border-bottom-left-radius: 15px;
		border-bottom-right-radius: 15px;
		text-align: center;
		border: 2px solid black;
		/*border-top: none;*/
		width: 100%;
	}

	p.title::before {
		content: "";
		position: absolute;
		bottom: 0;
		left: 0;
		width: var(--part-progress);
		height: 100%;
		backdrop-filter: invert(1);
		z-index: 5;
	}

</style>