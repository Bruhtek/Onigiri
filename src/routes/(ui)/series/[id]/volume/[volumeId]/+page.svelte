<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div>
	{data.seriesId}
	{data.volumeId}
</div>