<script lang="ts">
	import { token } from "../../../lib/stores/accountStore";
	import { useNavigate } from "svelte-navigator";
	import { jfetch } from "../../../lib/jnovel";
	import type { Login } from "../../../lib/RequestResponses/Auth";

	const navigate = useNavigate();

	let errorMessage = "";

	let login = "";
	let password = "";

	let loginInProgress = false;

	const tryLogin = async () => {
		loginInProgress = true;
		const res = await jfetch("/auth/login?format=json", {
			method: "POST",
			body: JSON.stringify({
				login: login,
				password: password,
				slim: true,
			}),
		});

		if (res.status !== 200 && res.status !== 201) {
			console.log("Login failed");
			switch (res.status) {
				case 401:
					errorMessage = "Login failed: Invalid username or password";
					break;
				case 429:
					errorMessage = "Login failed: Too many login attempts. Try again later";
					break;
				default:
					errorMessage = `Login failed: Status code ${res.status} ${res.statusText}`;
					break;
			}
			loginInProgress = false;
			return;
		}

		const data = await res.json() as Login;
		loginInProgress = false;
		navigate("/", { replace: true });
		token.set(data.id);
	};
</script>

<div class="email-login">
	<h1>Log in</h1>
	<label for="login">Email</label>
	<input bind:value={login} id="login" name="login" type="text" />
	<label for="password">Password</label>
	<input bind:value={password} id="password" name="password" type="password" />
	<button disabled={loginInProgress} on:click={tryLogin}>Log in</button>
	{#if errorMessage}
		<p>{errorMessage}</p>
	{/if}
</div>

<style>
	.email-login {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	input {
		width: max(20em, 50vw);
		height: 2em;
		border: 2px solid black;
		padding: 0.2rem;
		border-radius: 0.2rem;
	}

	button {
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	p {
		display: block;
		height: 2rem;
		min-width: 1rem;
	}
</style>