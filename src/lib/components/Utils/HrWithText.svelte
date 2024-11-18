<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		width?: string;
		children: Snippet;
	}

	const props: Props = $props();
</script>

<p style="--width: {props.width ?? '100%'}" class="hr">
	{@render props.children()}
</p>

<style>
	.hr {
		width: var(--width);
		display: flex;
		align-items: center;
		text-align: center;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}

	.hr::before,
	.hr::after {
		content: '';
		flex: 1;
		border-bottom: 2px solid var(--text);
	}

	.hr:not(:empty)::before {
		margin-right: .25em;
	}

	.hr:not(:empty)::after {
		margin-left: .25em;
	}
</style>