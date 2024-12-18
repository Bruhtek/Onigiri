<script lang="ts">
	interface Props {
		onTap: () => void;
		title: string;
		shortTitle: string;
		multiple?: boolean;
	}

	let active = $state<boolean>(true);

	let { onTap, title, shortTitle, multiple = false }: Props = $props();

	const onClick = () => {
		onTap();
		if (!multiple) {
			active = false;
		}
	};
</script>

<div class="container">
	<div class="title">
		{title}
	</div>
	<div class="value-container">
		<button class="button" onclick={onClick} disabled={!active}>
			{shortTitle}
		</button>
	</div>
</div>

<style>
	.container {
		margin-top: 0.2rem;
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

	button[disabled] {
		pointer-events: none;
		color: gray;
		border-color: gray;
	}
</style>