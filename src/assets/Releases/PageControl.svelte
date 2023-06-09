<script lang="ts">
	import { ArrowLeftIcon, ArrowRightIcon } from "svelte-feather-icons";

	export let page: number = 0;
	export let nextPage: () => void;
	export let prevPage: () => void;
</script>

<div class="page-control">
	<div class="icon-button" on:click={prevPage}>
		<ArrowLeftIcon on:click={prevPage} />
	</div>
	<p>Page {page + 1}</p>
	<div class="icon-button" on:click={nextPage}>
		<ArrowRightIcon />
	</div>
</div>

<style>
	.page-control {
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		top: -0.3rem;
		right: -0.3rem;
		padding: 0.3rem;
		font-size: 1.2rem;
		color: #000;
		background-color: #fff;
		border: 3px solid #000;
	}
</style>