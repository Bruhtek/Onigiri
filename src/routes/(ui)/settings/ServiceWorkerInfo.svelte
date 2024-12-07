<script lang="ts">
	import { onMount } from 'svelte';
	import { broadcastWithResponse } from '$lib/lifecycle/serviceWorker';
	import type { StatusMessage } from '$lib/types/broadcastMessageTypes';

	import Hourglass from '~icons/ph/hourglass';
	import Question from '~icons/ph/question';
	import CheckCircle from '~icons/ph/check-circle';
	import WarningOctagon from '~icons/ph/warning-octagon';

	let serviceWorkerStatus = $state<Promise<unknown>>();

	const checkServiceWorkerStatus = () => {
		serviceWorkerStatus = undefined;
		serviceWorkerStatus = broadcastWithResponse({ type: 'StatusMessage' } as StatusMessage);
		serviceWorkerStatus.then((res) => {
			if (res && typeof res === 'object' && 'status' in res && res.status === 'installing') {
				setTimeout(() => {
					checkServiceWorkerStatus();
				}, 1000);
			}
		});
		serviceWorkerStatus.catch(() => {
			setTimeout(() => {
				checkServiceWorkerStatus();
			}, 1000);
		});
	};

	onMount(() => {
		checkServiceWorkerStatus();
	});
</script>

<div class="container">
	<p>Service worker status</p>
	<p>
		{#await serviceWorkerStatus}
			<span class="loading">
				<Hourglass width="32" height="32" /> Wait
			</span>
		{:then res}
			{#if res && typeof res === 'object' && 'status' in res && res.status === 'active'}
				<span class="success">
					<CheckCircle width="32" height="32" /> Active
				</span>
			{:else if res && typeof res === 'object' && 'status' in res && res.status === 'installing'}
				<span class="success">
					<Hourglass width="32" height="32" /> Installing
				</span>
			{:else}
				<span class="success">
					<Question width="32" height="32" /> Unknown
				</span>
			{/if}
		{:catch _}
			<span class="error">
				<WarningOctagon width="32" height="32" /> Not working
			</span>
		{/await}
	</p>
</div>

<style>
	.container {
		text-align: left;
		width: 100%;
		margin: 1rem 0;
		font-size: 1.2rem;
		display: flex;
		justify-content: space-between;
	}

	.container p, .container span {
		display: flex;
		place-content: center;
		place-items: center;
	}

	.container span {
		gap: 0.5rem;
	}
</style>