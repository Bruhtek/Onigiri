<script lang="ts">
	import Dialog from '$lib/stores/Dialog.js';
	import { untrack } from 'svelte';

	let value = $state<never>();
	let setValOnce = $state<boolean>(false);

	const onCancel = () => {
		Dialog.clear();
		setValOnce = false;
	};
	const onClear = () => {
		value = '';
		onSubmit();
	};
	const onSubmit = () => {
		if (!Dialog.current) return;
		if (value === undefined || (!value && Dialog.current.type !== 'string')) return;

		Dialog.current.callback(value);
		Dialog.clear();
		value = undefined;
		setValOnce = false;
	};

	$effect(() => {
		if (!Dialog.current) return;

		if (Dialog.current.type === 'string' && !value && !setValOnce) {
			console.log('Setting once');
			value = Dialog.current.currentValue as never;
		}

		setValOnce = true;

		if (!Dialog.current || !Dialog.current.hotReload) return;

		untrack(() => {
			if (!Dialog.current || !Dialog.current.hotReload) return;

			Dialog.current.callback(value as never);
		});
	});

	function grabFocus(node: HTMLElement) {
		node.focus();
	}
</script>

{#if Dialog.current}
	<button class="bg" onclick={onCancel} aria-label="bg"></button>
	<div class="dialog-body">
		<h3>{Dialog.current.title}</h3>
		{#if Dialog.current.type === "number"}
			<input type="number"
				   placeholder={Dialog.current.currentValue.toString()}
				   use:grabFocus
				   bind:value={value}
			/>
		{/if}
		{#if Dialog.current.type === "string"}
			<input type="text"
				   use:grabFocus
				   bind:value={value}
			/>
		{/if}
		<div class="buttons">
			{#if Dialog.current.type === "string"}
				<button class="button" onclick={onClear}>
					Clear
				</button>
			{/if}
			{#if !Dialog.current.hotReload}
				<button class="button" onclick={onCancel}>
					Cancel
				</button>
				<button class="button" onclick={onSubmit}>
					Submit
				</button>
			{:else}
				<button class="button" onclick={onCancel}>
					Done
				</button>
			{/if}
		</div>

	</div>
{/if}

<style>
	.bg {
		z-index: 50;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.dialog-body {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: var(--bg);
		color: var(--text);
		z-index: 100;
		padding: 1rem;
		border-radius: 20px;
		overflow: hidden;
		border: 3px solid var(--text);
		box-shadow: 1px 1px 10px var(--text);
	}

	.buttons {
		display: flex;
		gap: 0.5rem;
		justify-content: right;
	}
</style>