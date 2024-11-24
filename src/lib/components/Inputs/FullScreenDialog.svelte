<script lang="ts">
	import { dialogStore } from '$lib/stores/dialogStore.svelte';

	let value = $state<number>();

	const onCancel = () => {
		dialogStore.set(undefined);
	};
	const onSubmit = () => {
		if (!value) return;
		if (!dialogStore.value) return;

		dialogStore.value.callback(value);
		dialogStore.set(undefined);
		value = undefined;
	};
</script>

{#if dialogStore.value}
	<div class="bg"></div>
	<div class="dialog-body">
		<h3>{dialogStore.value.title}</h3>
		{#if dialogStore.value.type === "number"}
			<input type="number"
				   placeholder={dialogStore.value.currentValue.toString()}
				   bind:value={value}
			/>
		{/if}

		<div class="buttons">
			<button class="button" onclick={onCancel}>
				Cancel
			</button>
			<button class="button" onclick={onSubmit}>
				Submit
			</button>
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