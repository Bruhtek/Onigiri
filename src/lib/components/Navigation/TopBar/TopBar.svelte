<script lang="ts">
	import PrefGeneral from '$lib/stores/preferences/General.svelte';
	import TopBarItem from '$lib/components/Navigation/TopBar/TopBarItem.svelte';

	import Calendar from '~icons/ph/calendar';
	import Books from '~icons/ph/books';
	import Gear from '~icons/ph/gear';
	import SignIn from '~icons/ph/sign-in';
	import User from '~icons/ph/user';
	import JAccount from '$lib/api/JAccount.svelte';

</script>

<div class="top-bar" class:responsive={PrefGeneral.v.verticalTabsWhileHorizontal}>
	<div class="top">
		<TopBarItem title="Releases" href="/" icon={Calendar} />
		<TopBarItem title="Series" href="/series" icon={Books} />
		<TopBarItem title="Settings" href="/settings" icon={Gear} />
	</div>
	<div class="bottom">
		{#if JAccount.loggedIn}
			<TopBarItem title="Account" icon={User} href="/account" />
		{:else}
			<TopBarItem title="Login" icon={SignIn} href="/login" />
		{/if}
	</div>
</div>

<style>
	.top-bar {
		height: 5rem;
		border-bottom: 3px solid var(--text);
		display: flex;
		justify-content: space-between;
		padding-left: 1rem;
		padding-right: 1rem;

		&.responsive {
			@media screen and (min-aspect-ratio: 1/1) {
				border-right: 3px solid var(--text);
				border-bottom: none;
				height: 100%;
				width: 6rem;
				flex-direction: column;
				padding: 1rem 0;
			}
		}
	}

	.top, .bottom {
		display: flex;
		gap: 1rem;
	}

	.responsive {
		@media screen and (min-aspect-ratio: 1/1) {
			.top, .bottom {
				flex-direction: column;
			}
		}
	}


</style>