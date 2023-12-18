<script lang="ts">
	import type { VolumePart } from "../../lib/types/VolumePart.js";
	import { link } from "svelte-routing";
	import { viewSettings } from "../../lib/stores/settingsStore";

	export let release: VolumePart;

	$: cssVars = `
	--part-progress: ${release.progress * 100}%;
	`
</script>

<a href="/reader/{release.id}/{release.progress}" style={cssVars} use:link>
	<div
		class="release"
		class:release-manga={release.isManga}
		class:release-expired={release.expired}
	>
		<img
			alt="Cover"
			class="cover"
			src="{$viewSettings.highCoverQuality ? release.coverURL : release.thumbnailURL}"
		/>
		<p class="title-container">
			<span class="title">{release.title}</span>
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
		overflow: hidden;
	}

	.release-manga, .release-expired {
		opacity: 0.7;
	}
	.release-expired::before {
		content: 'Expired';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 1.5rem;
		text-shadow: 2px 2px 0 white , -2px -2px 0 white , 2px -2px 0 white , -2px 2px 0 white , 0 2px 0 white , 2px 0 0 white , 0 -2px 0 white , -2px 0 0 white;
		z-index: 1001;
		background-color: rgba(0,0,0,0);
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

	.release p.title-container {
		position: absolute;
		bottom: 0;
		z-index: 10;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		border-bottom-left-radius: 15px;
		border-bottom-right-radius: 15px;
		text-align: center;
		border: 2px solid black;
		width: 100%;
		background: linear-gradient(90deg, rgba(0, 0, 0) 0%, rgb(0,0,0) var(--part-progress), rgb(255, 255, 255) var(--part-progress), rgb(255, 255, 255) 100%);
	}
	.title {
		color: white;
		mix-blend-mode: difference;
	}

</style>