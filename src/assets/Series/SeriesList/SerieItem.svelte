<script lang="ts">
	import { link } from "svelte-routing";
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

	.serie p.title {
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
</style>