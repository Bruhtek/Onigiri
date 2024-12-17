<script lang="ts">
	import HrWithText from '$lib/components/Utils/HrWithText.svelte';
	import CenteredLayout from '$lib/components/Layouts/CenteredLayout.svelte';
	import Numpad from '~icons/ph/numpad';
	import SignIn from '~icons/ph/sign-in';
	import Notifications from '$lib/stores/Notifications.svelte.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import JAccount from '$lib/api/JAccount.svelte';

	let email = $state('');
	let password = $state('');

	onMount(() => {
		const expired = $page.url.searchParams.get('expired');
		if (expired === 'true') {
			Notifications.warn('Your login expired. Please login again.');
		}
	});

	const onSubmit = async () => {
		const res = await JAccount.login(email, password);
		if (!res.error) {
			Notifications.success('Successfully logged in!');
			await goto('/');
		} else {
			Notifications.error(res.error);
		}
	};
</script>

<CenteredLayout>
	<h1>Login to J-Novel Club</h1>

	<div class="form">
		<label for="email">E-Mail</label>
		<input name="email" type="email" id="email" bind:value={email}>
		<label for="password">Password</label>
		<input name="password" type="password" id="password" bind:value={password}>

		<button onclick={onSubmit} class="button form-btn" type="button">
			<SignIn />
			Login
		</button>
	</div>

	<HrWithText width="80px">Or</HrWithText>

	<a class="button" href="/login/otp">
		<Numpad width="16" height="16" />
		Login with Code
	</a>
</CenteredLayout>

<style>
	h1 {
		margin-bottom: 1rem;
	}

	.form {
		display: flex;
		flex-direction: column;
		text-align: left;
	}

	.form-btn {
		width: max-content;
		margin: 0.2rem auto;
	}
</style>
