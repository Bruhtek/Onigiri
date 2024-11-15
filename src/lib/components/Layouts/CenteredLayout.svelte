<script lang="ts">

</script>

<div class="centered-layout">
	<slot />
</div>

<style>
	.centered-layout {
		display: flex;
		margin: auto;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 80%;
		min-width: 300px;
		text-align: center;
	}
</style>