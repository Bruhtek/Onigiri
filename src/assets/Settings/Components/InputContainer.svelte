<script lang="ts">
	export let event: (() => any) | undefined = undefined;
	export let fixedWidth: number | undefined = undefined;

	$: styles = fixedWidth ? `width: ${fixedWidth}px` : '';
</script>

{#if event}
	<div class="container" style={styles} on:click={event} on:keydown={event} role="button" tabindex="0">
		<slot />
	</div>
{:else}
	<div class="container" style={styles}>
		<slot />
	</div>
{/if}

<style>
	.container {
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 15px;
		border: 2px solid #000;
		margin: 5px;
		height: 50px;
		position: relative;
		width: max-content;
	}
</style>