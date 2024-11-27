<script lang="ts">
	// eslint-disable-next-line no-undef
	let changelog = $derived(__CHANGELOG_STRING__.trim().split('\n').map(s => [s.slice(0, 6), s.slice(7)]));
	let current_ver = $derived(changelog[0][0]);
</script>

<div class="changelog-container">
	<h2>
		Changelog
	</h2>
	<h4>
		Current version: {current_ver}
	</h4>
	<div class="list">
		{#each changelog as c}
			<p class="change-item">
				<a class="hash" href="https://github.com/Bruhtek/Onigiri/commit/{c[0]}" target="_blank">{c[0]}</a>
				<span class="title">{c[1]}</span>
			</p>
		{/each}
	</div>
	<a href="/settings" class="button">
		Go back
	</a>
</div>

<style>
	.changelog-container {
		position: relative;
		padding: 1rem;
		overflow: scroll;
	}

	.list {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.hash {
		font-family: monospace;
		display: inline-block;
		padding: 2px;
		background-color: lightgray;
		text-decoration: underline;
	}

	.button {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}
</style>