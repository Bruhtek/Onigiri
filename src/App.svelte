<script lang="ts">
	import { token, username } from "./lib/stores/accountStore";
	import LoginPage from "./assets/Account/Login/LoginPage.svelte";
	import { jfetch } from "./lib/jnovel";
	import Home from "./assets/MainPage.svelte";
	import NotificationsContainer from "./assets/Notifications/NotificationsContainer.svelte";
	import notificationStore from "./lib/stores/notificationStore";
	import type { MeResult } from "./lib/RequestResponses/Me";

	const fetchUserData = async () => {
		const res = await jfetch("/me");
		if (res.ok) {
			username.set((await res.json() as MeResult).username);
			return;
		}

		notificationStore.set({
			type: "warning",
			message: "Failed to fetch user data"
		})
	};

	$: if ($token && $username === "") {
		void fetchUserData();
	}

</script>

{#if $token}
	<NotificationsContainer />
	<Home />
{:else}
	<NotificationsContainer />
	<LoginPage />
{/if}
