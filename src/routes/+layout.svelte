<script lang="ts">
	import "../app.css";
	import notificationStore from '$lib/stores/notificationStore.svelte';

	export const prerender = true;
</script>

<div>
	{notificationStore.notification ? notificationStore.notification.title : "No new notifications"}
</div>

<slot />
