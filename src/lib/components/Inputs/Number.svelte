<script lang="ts">
	import Plus from '~icons/ph/plus';
	import Minus from '~icons/ph/minus';
	import ArrowArcLeft from '~icons/ph/arrow-arc-left';
	import { defaultReaderPreferencesData } from '$lib/stores/readerPreferencesStore.svelte';
	import requestDialog from '$lib/stores/dialogStore.svelte';

	interface Props {
		onChange: (selected: number) => void;
		current: number;
		title: string;
		min?: number;
		max?: number;
		defaultValue?: number;
		step?: number;
	}

	let { onChange, current, title, min = 0, max = 1000, defaultValue = current, step = 1 }: Props = $props();

	const increase = () => {
		const newVal = Math.round(Math.min(current + step, max) * 1000) / 1000;
		onChange(newVal);
	};
	const decrease = () => {
		const newVal = Math.round(Math.max(current - step, min) * 1000) / 1000;
		onChange(newVal);
	};
	const reset = () => {
		onChange(defaultValue);
	};
	const showDialog = () => {
		const callback = (v: number) => {
			const newVal = Math.round(Math.min(Math.max(v, min), max) / step) * step;
			onChange(newVal);
		};

		requestDialog({
			type: 'number',
			currentValue: current,
			title: title,
			description: '',
			callback,
		});
	};

	$inspect(defaultReaderPreferencesData);
</script>

<div class="container">
	<div class="title">
		{title}
	</div>
	<div class="value-container">
		{#if current !== defaultValue}
			<button onclick={reset}>
				<ArrowArcLeft width={32} height={32} />
			</button>
		{/if}
		<button onclick={decrease}>
			<Minus width={32} height={32} />
		</button>
		<button class="value" onclick={showDialog}>
			{current}
		</button>
		<button onclick={increase}>
			<Plus width={32} height={32} />
		</button>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.title {
		font-size: 1.15em;
		display: flex;
		align-content: center;
		align-items: center;
	}

	.value-container {
		display: flex;
		margin-right: 0.5rem;
		gap: 0.5rem;
	}

	.value-container button {
		cursor: pointer;
	}

	.value {
		cursor: pointer;
		font-size: 1.4em;
		text-decoration: underline;
		min-width: 2em;
		text-align: center
	}
</style>