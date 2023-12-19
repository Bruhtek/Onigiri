<script lang="ts">
	export let action: () => any;
</script>

<div class="button" on:click={action} on:keydown={action}>
	<slot />
</div>

<style>
	.button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		width: max-content;
		padding: 15px;
		border: 2px solid #000;
		margin: 5px;
		height: 50px;
	}
</style>