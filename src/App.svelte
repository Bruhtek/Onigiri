<script lang="ts">
	import Reader from "./assets/Reader/Reader.svelte";

	import { token, username } from "./lib/stores/accountStore";
	import LoginPage from "./assets/Account/Login/LoginPage.svelte";
	import { Route, Router } from "svelte-navigator";
	import { jfetch } from "./lib/jnovel";
	import { onMount } from "svelte";
	import Home from "./assets/MainPage.svelte";
	import NotificationsContainer from "./assets/Notifications/NotificationsContainer.svelte";
	import notificationStore from "./lib/stores/notificationStore";

	const fetchUserData = async () => {
		const res = await jfetch("/me");
		if (res.ok) {
			username.set((await res.json()).username);
			return;
		}

		notificationStore.set({
			type: "warning",
			message: "Failed to fetch user data"
		})
	};

	$: if ($token && $username === "") {
		fetchUserData();
	}

</script>

{#if $token}
	<NotificationsContainer />
	<Home />
{:else}
	<NotificationsContainer />
	<LoginPage />
{/if}

<style>

</style>