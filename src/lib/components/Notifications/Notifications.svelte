<script lang="ts">
	import notificationStore from '$lib/stores/notificationStore.svelte';
	import PhInfo from '~icons/ph/info';
	import PhCheckFat from '~icons/ph/check-fat';
	import WarningOctagon from '~icons/ph/warning-octagon';
	import Warning from '~icons/ph/warning';

	const iconMap = {
		'info': PhInfo,
		'success': PhCheckFat,
		'warning': Warning,
		'error': WarningOctagon
	};

	const dismissNotification = () => {
		notificationStore.dismiss();
	};
</script>

{#if notificationStore.notification}
	<div class="notification" onclick={dismissNotification} onkeydown={dismissNotification} role="button" tabindex="0">
		<div class="icon">
			{#if notificationStore.notification.icon}
				<svelte:component this={iconMap[notificationStore.notification.icon]} width="32" height="32" />
			{:else}
				<PhInfo width="32" height="32" />
			{/if}
		</div>
		{notificationStore.notification.message}
	</div>
{/if}

<style>
	.icon {
		display: inline-block;
	}

	.notification {
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		width: 80%;
		min-width: 200px;
		background-color: var(--bg);
		padding: 10px;
		border: 3px solid var(--text);
		display: flex;
		align-items: center;
		gap: 10px;
		border-radius: 20px;
		z-index: 10000;
	}
</style>