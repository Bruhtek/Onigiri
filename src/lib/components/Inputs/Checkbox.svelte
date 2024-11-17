<script lang="ts">
	import ArrowArcLeft from '~icons/ph/arrow-arc-left';

	interface Props {
		onChange: (selected: boolean) => void;
		current: boolean;
		title: string;
		defaultValue?: boolean;
	}

	let { onChange, current, title, defaultValue = current }: Props = $props();

	const onToggle = () => {
		onChange(!current);
	};
	const reset = () => {
		onChange(defaultValue);
	};
</script>

<label class="container">
	<div class="title">
		{title}
	</div>
	<div class="value-container">
		{#if current !== defaultValue}
			<button onclick={reset}>
				<ArrowArcLeft width={32} height={32} />
			</button>
		{/if}
		<input type="checkbox" name={title} checked={current} onchange={onToggle} />
	</div>
</label>

<style>
	.container {
		min-height: 32px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.title {
		font-size: 1.15em;
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

	input[type="checkbox"] {
		-webkit-appearance: none;
		appearance: none;
		background-color: #fff0;
		margin: 0;
		font: inherit;
		color: currentColor;
		width: 1.5em;
		height: 1.5em;
		border: 0.15em solid currentColor;
		border-radius: 0.15em;
	}

	input[type="checkbox"]:checked {
		border-width: 0.6em;
	}
</style>