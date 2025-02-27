<script lang="ts">
	import { onMount } from 'svelte';
	import Notifications from '$lib/stores/Notifications.svelte.js';
	import CenteredLayout from '$lib/components/Layouts/CenteredLayout.svelte';
	import { goto } from '$app/navigation';
	import JAccount, { type OTPResponse, OTPResponseState } from '$lib/api/JAccount.svelte';

	let otpData = $state<OTPResponse>();

	onMount(() => {
		(async () => {
			const res = await JAccount.otp_generate();
			if (res.error !== false) {
				Notifications.error(res.error);
				history.back();
			} else {
				otpData = res.data;
			}
		})();

		return async () => {
			if (otpData) {
				await JAccount.otp_delete(otpData);
			}
		};
	});

	$effect(() => {
		if (!otpData) {
			return;
		}

		const interval = setInterval(async () => {
			if (!otpData) {
				return;
			}

			const res = await JAccount.otp_check(otpData);
			if (res.error !== false) {
				Notifications.error(res.error);
				history.back();
			} else if (res.data === OTPResponseState.LoggedIn) {
				Notifications.success('You are now logged in');
				otpData = undefined;
				await goto('/');
			}
		}, 4000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<CenteredLayout>
	{#if otpData}
		<div>
			Visit
			<a class="underlined" href="https://j-novel.club/user/otp" target="_blank">https://j-novel.club/user/otp</a>
			and type in the code
			<span class="code monospace">{otpData.otp}</span>
			to authorize the application
		</div>

		<button class="button" onclick={() => history.back()}>
			Cancel
		</button>
	{:else}
		Loading...
	{/if}
</CenteredLayout>

<style>
	.code {
		font-weight: bold;
		margin: 0 0.2rem;
		font-family: monospace;
		font-size: 1.5rem;
		letter-spacing: 0.2rem;
	}

	.button {
		margin-top: 0.5rem;
	}
</style>