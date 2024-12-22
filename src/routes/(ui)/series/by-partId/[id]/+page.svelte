<script lang="ts">
	import CenteredLayout from '$lib/components/Layouts/CenteredLayout.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<CenteredLayout>
	<h2>Loading...</h2>
</CenteredLayout>