<script lang="ts">
	export let currentPage: number;
	export let totalPages: number;
</script>

<div class="bottom-navbar">
	<div class="page-counter">
		{currentPage} / {totalPages}
	</div>
</div>

<style>
	.bottom-navbar {
		height: 1.5rem;
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		align-content: center;
		text-align: center;
	}
	.border {
		border-top: 2px solid black;
	}
</style>