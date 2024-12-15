<script lang="ts">
	import { dialogStore } from '$lib/stores/dialogStore.svelte';
	import { untrack } from 'svelte';

	let value = $state<never>();
	let setValOnce = $state<boolean>(false);

	const onCancel = () => {
		dialogStore.set(undefined);
		setValOnce = false;
	};
	const onClear = () => {
		value = '';
	};
	const onSubmit = () => {
		if (!value) return;
		if (!dialogStore.value) return;

		dialogStore.value.callback(value);
		dialogStore.set(undefined);
		value = undefined;
		setValOnce = false;
	};

	$effect(() => {
		if (dialogStore.value && dialogStore.value.type === 'string' && !value && !setValOnce) {
			value = dialogStore.value.currentValue as never;
		}

		setValOnce = true;

		if (!dialogStore.value || !dialogStore.value.hotReload) return;

		untrack(() => {
			if (!dialogStore.value || !dialogStore.value.hotReload) return;

			dialogStore.value.callback(value as never);
		});
	});
</script>

{#if dialogStore.value}
	<button class="bg" onclick={onCancel} aria-label="bg"></button>
	<div class="dialog-body">
		<h3>{dialogStore.value.title}</h3>
		{#if dialogStore.value.type === "number"}
			<input type="number"
				   placeholder={dialogStore.value.currentValue.toString()}
				   bind:value={value}
			/>
		{/if}
		{#if dialogStore.value.type === "string"}
			<input type="text"
				   bind:value={value}
			/>
		{/if}
		<div class="buttons">
			{#if dialogStore.value.type === "string"}
				<button class="button" onclick={onClear}>
					Clear
				</button>
			{/if}
			{#if !dialogStore.value.hotReload}
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