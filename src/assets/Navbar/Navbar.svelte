<script lang="ts">
	import { ArrowLeftIcon, ArrowRightIcon } from "svelte-feather-icons";
	import { Link, useLocation, useNavigate } from "svelte-navigator";

	const location = useLocation();
	const navigation = useNavigate();
	$: current = $location.pathname;

	export let items: { [key: string]: string } = {};
	export let backUrl: string | null = "";
	export let forwardUrl: string | null = "";

	const goBack = () => {
		if(backUrl === "") {
			navigation(-1);
		} else {
			navigation(backUrl);
		}
	};
	const goForward = () => {
		if(forwardUrl === "") {
			navigation(1);
		} else {
			navigation(forwardUrl);
		}
	};

</script>

<div class="navbar">
	{#each Object.keys(items) as key}
		<Link class="link" to={key} replace={false}>{items[key]}</Link>
	{/each}
	{#if backUrl !== null}
		<div class="navbar-icon back" on:click={goBack} on:keydown={goBack}>
			<ArrowLeftIcon size="2x" />
		</div>
	{/if}
	{#if forwardUrl !== null}
		<div class="navbar-icon forward" on:click={goForward} on:keydown={goForward}>
			<ArrowRightIcon size="2x" />
		</div>
	{/if}
</div>

<style>
	.navbar :global(.link) {
		border: none;
		padding: 0;
	}

	.navbar :global(.link:hover) {
		color: black;
		background-color: unset;
	}

	.navbar :global(.link[aria-current="page"]) {
		border-bottom: 3px solid black;
	}

	.navbar {
		position: relative;
		width: 100%;
		height: 50px;
		border-top: 3px solid black;
		border-bottom: 3px solid black;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	}

	/*.fullscreen {*/
	/*	position: absolute;*/
	/*	top: 0;*/
	/*	left: 0;*/
	/*}*/

	.back {
		position: absolute;
		top: 0;
		left: 0;
	}
	.forward {
		position: absolute;
		top: 0;
		right: 0;
	}

	.navbar-icon {
		height: 100%;
		aspect-ratio: 1/1;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>