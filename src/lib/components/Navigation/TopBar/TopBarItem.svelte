<script lang="ts">
	import Books from '~icons/ph/books';
	import { page } from '$app/stores';
	import preferencesStore from '$lib/stores/preferencesStore.svelte';

	interface Props {
		title: string;
		icon: typeof Books;
		href: string;
	}

	let matches = $derived.by(() => {
		let currentUrl = $page.url;
		let targetUrl = props.href;

		if (targetUrl === '/') {
			return currentUrl.pathname === targetUrl;
		}
		return currentUrl.pathname.startsWith(targetUrl);
	});

	let props: Props = $props();
</script>


<a class="navbar-item"
   class:current={matches}
   class:responsive={preferencesStore.value.verticalTabsWhileHorizontal}
   href={props.href}
>
	<div class="icon-container">
		<props.icon width="32" height="32" />
	</div>
	<div class="title">
		{props.title}
	</div>
</a>

<style>
	.navbar-item {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
	}

	.navbar-item.responsive {
		@media screen and (min-aspect-ratio: 1/1) {
			padding: 0.5rem 1rem;
		}
	}

	.current:before {
		content: '';
		position: absolute;
		width: 90%;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
		height: 5px;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--text);
	}

	.current.responsive:before {
		@media screen and (min-aspect-ratio: 1/1) {
			width: 5px;
			height: 80%;
			top: 50%;
			left: 0;
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 10px;
			border-top-right-radius: 10px;
			transform: translateY(-50%);
		}
	}
</style>