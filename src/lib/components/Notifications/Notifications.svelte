<script lang="ts">
	import Notifications from '$lib/stores/Notifications.svelte.js';
	import PhInfo from '~icons/ph/info';
	import PhCheckFat from '~icons/ph/check-fat';
	import XCircle from '~icons/ph/x-circle';
	import Warning from '~icons/ph/warning';

	const iconMap = {
		'info': PhInfo,
		'success': PhCheckFat,
		'warning': Warning,
		'error': XCircle,
	};

	const dismissNotification = () => {
		Notifications.dismiss();
	};
</script>

{#if Notifications.current}
	<div class="notification" onclick={dismissNotification} onkeydown={dismissNotification} role="button" tabindex="0">
		<div class="icon">
			{#if Notifications.current.icon}
				<svelte:component this={iconMap[Notifications.current.icon]} width="32" height="32" />
			{:else}
				<PhInfo width="32" height="32" />
			{/if}
		</div>
		{Notifications.current.message}
	</div>
{/if}

<style>
	.icon {
		display: inline-block;
	}

	.notification {
		position: absolute;
		top: 30px;
		right: 30px;
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