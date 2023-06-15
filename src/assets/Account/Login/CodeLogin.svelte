<script lang="ts">
	import { token } from "../../../lib/stores/accountStore";

	import { jfetch } from "../../../lib/jnovel";
	import { onMount } from "svelte";
	import { useNavigate } from "svelte-navigator";
	import notificationStore from "../../../lib/stores/notificationStore";

	const navigate = useNavigate();


	let otp = "";
	let proof = "";

	let inProgress = false;

	let errorMessage = "";

	const generateCode = async () => {
		inProgress = true;
		const res = await jfetch("/auth/otp4app/generate");
		if (res.ok) {
			const data = await res.json();
			otp = data.otp;
			proof = data.proof;
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
		const res = await jfetch(`/auth/otp4app/check/${otp}/${proof}`);

		console.log(res);

		if (res.status === 200 || res.status === 201) {
			const data = await res.json();
			navigate("/");
			token.set(data.id);
		} else {
			errorMessage = "Error logging in. Try again.";
			otp = "";
			proof = "";
		}
		inProgress = false;
	};

</script>

<div class="code-login">
	{#if otp}
		<p>
			Visit
			<a href="https://j-novel.club/user/otp">https://j-novel.club/user/otp</a>
			and enter the following code: {otp}
		</p>

		<p>
			After you have entered the code, click the button below to complete the process.
		</p>

		<button on:click={checkOTP} disabled={inProgress}>Login</button>
	{:else}
		<button on:click={generateCode} disabled={inProgress}>Generate code</button>
	{/if}

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
</style>