<script lang="ts">
	import notificationStore from '$lib/stores/notificationStore.svelte';

	let count = $state(0);
</script>

<button onclick={() => notificationStore.notify({title: `Notification number ${count++}`, message: ""})}>
	Push new notification
</button>