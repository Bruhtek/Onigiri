<script lang="ts">
	import CenteredLayout from '$lib/components/Layouts/CenteredLayout.svelte';
	import Branding from './Branding.svelte';
	import Settings from './Settings.svelte';
	import ServiceWorkerInfo from './ServiceWorkerInfo.svelte';

	// eslint-disable-next-line no-undef
	let changelog = $derived(__CHANGELOG_STRING__.trim().split('\n').map(s => [s.slice(0, 6), s.slice(7)]));
	let current_ver = $derived(changelog[0][0]);
</script>

<CenteredLayout>
	<Branding />
	<Settings />
	<ServiceWorkerInfo />
</CenteredLayout>

<div class="container">
	<div class="title">
		Current version - <span class="monospace">{current_ver}</span>
	</div>
	<div class="value-container">
		<a href="/settings/changelog" class="button">
			Open changelog
		</a>
	</div>
</div>


<style>
	.monospace {
		display: inline-block;
		font-family: monospace;
		padding: 0.2rem;
		background-color: lightgray;
	}

	.container {
		min-height: 32px;
		display: flex;
		flex-direction: column;
		width: max-content;
		margin: 1rem auto;
		gap: 0.5rem;
		justify-content: space-between;
	}
</style>