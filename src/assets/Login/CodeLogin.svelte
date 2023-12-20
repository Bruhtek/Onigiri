<script lang="ts">
	import { token } from "../../lib/stores/accountStore";

	import { jfetch } from "../../lib/jnovel";
	import { navigate } from "svelte-routing";
	import notificationStore from "../../lib/stores/notificationStore";
	import type { Otp4appCheck, Otp4appGenerate } from "../../lib/RequestResponses/Auth";
	import { onMount } from "svelte";
	import { otp, otp_proof } from "../../lib/stores/accountStore";

	let inProgress = false;

	let errorMessage = "";

	onMount(() => {
		if(!$otp) {
			generateCode();
		}
	})

	const generateCode = async () => {
		inProgress = true;
		const res = await jfetch("/auth/otp4app/generate");
		if (res.ok) {
			const data = (await res.json()) as Otp4appGenerate;
			otp.set(data.otp);
			otp_proof.set(data.proof);
		} else {
			notificationStore.set({
				type: "error",
				message: "Error generating code. Try again in a few seconds."
			})
		}
		inProgress = false;
	};

	const checkOTP = async () => {
		inProgress = true;
		const res = await jfetch(`/auth/otp4app/check/${$otp}/${$otp_proof}`);

		if (res.status === 200 || res.status === 201) {
			const data: Otp4appCheck = await res.json() as Otp4appCheck;
			navigate("/");
			token.set(data.id);
		} else {
			errorMessage = "Error logging in. Try again.";
			otp.set("");
			otp_proof.set("");
		}
		inProgress = false;
	};

</script>

<div class="code-login">
	<p>
		Visit
		<a href="https://j-novel.club/user/otp" target="_blank">https://j-novel.club/user/otp</a>
		and enter the following code:
		{#if $otp}
			<span class="otp">{$otp}</span>
		{:else}
			<b>Loading...</b>
		{/if}
	</p>

	<p>
		After you have entered the code, click the button below to complete the process.
	</p>

	<div class="button-container">
		<button on:click={() => history.back()}>Back</button>
		<button on:click={generateCode} disabled={inProgress}>Regenerate Code</button>
		<button on:click={checkOTP} disabled={inProgress}>Login</button>
	</div>


	{#if errorMessage}
		<p>{errorMessage}</p>
	{/if}
</div>

<style>
	.code-login {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.button-container {
		margin-top: 1rem;
	}

	.otp {
		padding: 0.5rem;
		font-weight: bold;
		font-family: monospace;
		font-size: 1.5rem;
		letter-spacing: 0.5rem;
	}
</style>