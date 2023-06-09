<script lang="ts">
	export let currentPage: number;
	export let totalPages: number;
</script>

<div class="page-counter">
	{currentPage} / {totalPages}
</div>

<style>
	.page-counter {
		position: absolute;
		bottom: 2px;
		left: 50%;
		transform: translateX(-50%);
	}
</style>