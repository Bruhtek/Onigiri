<script lang="ts">
	import { Maximize2Icon, Minimize2Icon, ArrowLeftIcon, ArrowRightIcon } from "svelte-feather-icons";
	import { onMount } from "svelte";
	import { Link, useLocation, useNavigate } from "svelte-navigator";
	import NavLink from "./NavLink.svelte";

	const location = useLocation();
	const navigation = useNavigate();
	$: current = $location.pathname;

	let maximized = window.document.fullscreenElement !== null;

	const toggleFullscreen = () => {
		if (window.document.fullscreenElement !== null) {
			window.document.exitFullscreen();
		} else {
			window.document.documentElement.requestFullscreen();
		}
	};

	const goback = () => {
		navigation(-1);
	};
	const goforward = () => {
		navigation(1);
	};

	onMount(() => {
		window.document.addEventListener("fullscreenchange", () => {
			maximized = window.document.fullscreenElement !== null;
		});
	});
</script>

<div class="navbar">
	<NavLink currentUrl={current} to="/">Releases</NavLink>
	<NavLink currentUrl={current} to="/series">Series</NavLink>
	<NavLink currentUrl={current} to="/profile">Profile</NavLink>
	<div class="navbar-icon back" on:click={goback}>
		<ArrowLeftIcon size="2x" />
	</div>
	<div class="navbar-icon forward" on:click={goforward}>
		<ArrowRightIcon size="2x" />
	</div>
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

	.navbar :global(.link.current-link) {
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