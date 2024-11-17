<script lang="ts">
	import Books from '~icons/ph/books';

	interface Props {
		title: string;
		icon: typeof Books;
		href: string;
	}

	let props: Props = $props();
</script>


<a class="navbar-item" href={props.href}>
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
	}
</style>