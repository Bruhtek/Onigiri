<script lang="ts">

</script>

<div class="container">
	<div>
		<img class="logo" src="apple-touch-icon.png" alt="Onigiri Logo" />
	</div>
	<div class="title-container">
		<h1>Onigiri</h1>
		<h2>for J-Novel Club</h2>
	</div>
</div>

<style>
	.container {
		display: flex;
		text-align: left;
		gap: 1rem;
	}

	.title-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.logo {
		display: block;
		border: 4px solid var(--text);
		border-radius: 30%;
		overflow: hidden;
		width: 80px;
		aspect-ratio: 1/1;
	}
</style>