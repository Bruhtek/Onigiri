<script lang="ts">
	import { Link } from "svelte-navigator";

	export let to: string;
	export let replace: boolean;
	export let currentUrl: string;
</script>

<Link class="link {currentUrl === to ? 'current-link' : ''}" {replace} {to}>
	<slot />
</Link>

<style>

</style>