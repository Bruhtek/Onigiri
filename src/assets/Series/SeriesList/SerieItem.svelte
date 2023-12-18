<script lang="ts">
	import { link } from "svelte-navigator";
	import { viewSettings } from "../../../lib/stores/settingsStore";
	import type { Series } from "../../../lib/types/Series";

	export let serie: Series;

</script>

<a href="/series/{serie.id}" use:link>
	<div class="serie">
		<img
			alt="Cover"
			class="cover"
			src="{$viewSettings.highCoverQuality ? serie.coverURL : serie.thumbnailURL}"
		/>
		<p class="title">
			{serie.title}
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

	.serie {
		height: 100%;
		width: var(--item-width);
		background-color: #aaa;
		position: relative;
		z-index: 1;
		border-radius: 15px;
	}

	.serie img {
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
</style>