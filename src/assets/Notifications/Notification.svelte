<script lang="ts">
	import { CheckIcon, AlertOctagonIcon, AlertTriangleIcon, InfoIcon } from "svelte-feather-icons";
	import toProperCase from "../../lib/utils/toProperCase";

	export let type: "success" | "error" | "warning" | "info" = "success";
	export let message: string = "";
	export let dismissNotification: () => void = () => {};

	const iconSize = "2x";
</script>

<div class="notification" on:click={dismissNotification}>
	<div class="upper">
		{#if type === "success"}
			<CheckIcon class="icon" size={iconSize} />
		{:else if type === "error"}
			<AlertOctagonIcon class="icon" size={iconSize} />
		{:else if type === "warning"}
			<AlertTriangleIcon class="icon" size={iconSize} />
		{:else if type === "info"}
			<InfoIcon class="icon" size={iconSize} />
		{/if}
		<p class="type">
			{toProperCase(type)}
		</p>
	</div>
	<p class="message">
		{message}
	</p>
</div>

<style>
	.notification {
		background-color: #fff;
		border: 3px solid black;
		padding: 1rem;
		pointer-events: auto;
	}

	.upper {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>

