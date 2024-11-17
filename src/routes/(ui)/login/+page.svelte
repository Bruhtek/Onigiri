<script lang="ts">
	import HrWithText from '$lib/components/Utils/HrWithText.svelte';
	import CenteredLayout from '$lib/components/Layouts/CenteredLayout.svelte';
	import Numpad from '~icons/ph/numpad';
	import SignIn from '~icons/ph/sign-in';
	import { login } from '$lib/api/account.svelte';
	import notificationStore from '$lib/stores/notificationStore.svelte';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');

	const onSubmit = async () => {
		const [success, error] = await login(email, password);
		if (success) {
			notificationStore.success('Successfully logged in!');
			await goto('/');
		} else {
			notificationStore.error(error);
		}
	};
</script>

<CenteredLayout>
	<h1>Login to J-Novel Club</h1>

	<div class="form">
		<label for="email">E-Mail</label>
		<input name="email" type="email" bind:value={email}>
		<label for="password">Password</label>
		<input name="password" type="password" bind:value={password}>

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
