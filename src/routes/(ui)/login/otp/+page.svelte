<script lang="ts">

	import { onMount } from 'svelte';
	import { otp_check, otp_delete, otp_generate, type OTPResponse, OTPResponseStates } from '$lib/api/account.svelte';
	import notificationStore from '$lib/stores/notificationStore.svelte';
	import CenteredLayout from '$lib/components/Layouts/CenteredLayout.svelte';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	let otpData = $state<OTPResponse>();
	let shouldRedirect = $state<boolean>(false);

	onMount(() => {
		(async () => {
			const [data, err] = await otp_generate();
			if (err != null) {
				notificationStore.error(err);
				history.back();
			} else {
				otpData = data;
			}
		})();

		return async () => {
			if (otpData) {
				await otp_delete(otpData);
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

			const [status, error] = await otp_check(otpData);
			if (status === OTPResponseStates.LoggedIn) {
				notificationStore.success('You are now logged in');
				otpData = undefined;
				await goto('/');
			} else if (status === OTPResponseStates.Errored) {
				notificationStore.error(error);
				history.back();
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
			<span class="code">{otpData.otp}</span>
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
		display: inline-block;
		padding: 0.5rem;
		font-weight: bold;
		font-family: monospace;
		font-size: 1.5rem;
		letter-spacing: 0.5rem;
	}
</style>