<script lang="ts">
	import HrWithText from '$lib/components/Utils/HrWithText.svelte';
	import CenteredLayout from '$lib/components/Layouts/CenteredLayout.svelte';
	import Numpad from '~icons/ph/numpad';
	import SignIn from '~icons/ph/sign-in';
	import { logIn } from '$lib/api/account.svelte';
	import { redirect } from '@sveltejs/kit';
	import notificationStore from '$lib/stores/notificationStore.svelte';

	let email = $state("");
	let password = $state("");

	const onSubmit = async () => {
		const res = await logIn(email, password);
		if(res == null) {
			notificationStore.success("Succesfully logged in!");
			redirect(307, "/");
		} else {
			notificationStore.error(res);
		}
	}
</script>

<CenteredLayout>
	<h1>Login to J-Novel Club</h1>

	<div class="form">
		<label for="email">E-Mail</label>
		<input name="email" type="email" bind:value={email}>
		<label for="password">Password</label>
		<input name="password" type="password" bind:value={password}>

		<button onclick={onSubmit} class="button form-btn" type="button">
			<SignIn /> Login
		</button>
	</div>

	<HrWithText width="80px">Or</HrWithText>

	<a class="button" href="/login/otp">
		<Numpad width="16" height="16" /> Login with Code
	</a>
</CenteredLayout>

<style>
	h1 {
		margin-bottom: 1rem;
	}
	.form {
		display: flex;
		flex-direction: column;
	}

	.form-btn {
		width: max-content;
		margin: 0.2rem auto;
	}
</style>
