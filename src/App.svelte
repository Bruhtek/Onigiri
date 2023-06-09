<script lang="ts">
	import Reader from "./assets/Reader/Reader.svelte";

	import { token, username } from "./lib/stores/accountStore";
	import LoginPage from "./assets/Account/Login/LoginPage.svelte";
	import { Route, Router } from "svelte-navigator";
	import { jfetch } from "./lib/jnovel";
	import { onMount } from "svelte";
	import Home from "./assets/MainPage.svelte";

	const fetchUserData = async () => {
		const res = await jfetch("/me");
		if (res.ok) {
			username.set((await res.json()).username);
		}
	};

	$: if ($token && $username === "") {
		fetchUserData();
	}

	// onMount(() => {
	// 	if ($token) fetchUserData();
	// });
</script>

{#if $token}
	<Home />
{:else}
	<LoginPage />
{/if}

<!--{#if $token === null || $token === undefined || $token === ""}-->
<!--	<LoginPage />-->
<!--{:else}-->
<!--	<Reader />-->
<!--{/if}-->

<style>

</style>