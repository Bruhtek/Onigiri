<script lang="ts">
	interface Props {
		page: number;
		totalPages: number;
	}

	let props: Props = $props();
</script>

{#if props.totalPages !== 0}
	<div class="bottom-bar">
		<div class="left">

		</div>
		<div class="center">
			{props.page + 1} / {props.totalPages + 1}
		</div>
		<div class="right">

		</div>
	</div>
{/if}

<style>
	.bottom-bar {
		position: absolute;
		width: 100%;
		height: var(--bottom-bar-height);
		left: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>