<script lang="ts">
	import notificationStore from "../../lib/stores/notificationStore";
	import type { Notification as NotificationType } from "../../lib/types/Notification";
	import Notification from "./Notification.svelte";

	let notification: NotificationType = null;

	notificationStore.subscribe((value) => {
		if(value) {
			notification = value;
			setTimeout(() => {
				notification = null;
				notificationStore.set(null);
			}, notification.duration ?? 5000);
		}
	});

	const dismiss = () => {
		notification = null;
		notificationStore.set(null);
	}
</script>

<div class="notification-container">
	{#if notification !== null}
		<Notification type={notification.type} message={notification.message} dismissNotification={dismiss} />
	{/if}
</div>

<style>
	.notification-container {
		position: absolute;
		top: 0;
		right: 0;
		width: 50%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: flex-start;
		padding: 1rem;
		z-index: 1000;
		pointer-events: none;
	}
</style>