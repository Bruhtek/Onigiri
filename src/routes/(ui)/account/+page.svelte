<script lang="ts">
	import CenteredLayout from '$lib/components/Layouts/CenteredLayout.svelte';
	import User from '~icons/ph/user';
	import { toProperCase } from '$lib/helpers/utils';

	import { accountInfoStore, getAccountInfo } from '$lib/api/account.svelte';
</script>

<CenteredLayout>
	{#if accountInfoStore.value === undefined}
		<p>Error loading account data! Click the button below to try again!</p>
		<button class="button" onclick={getAccountInfo}>
			Retry
		</button>
	{:else}
		<div class="user-info">
			<div class="left">
				{#if accountInfoStore.value.emailHash}
					<img src="https://gravatar.com/avatar/{accountInfoStore.value.emailHash}" alt="User gravatar" />
				{:else}
					<User width="64" height="64" />
				{/if}
			</div>
			<div class="right">
				<h1>{accountInfoStore.value.username}</h1>
				<h2>{accountInfoStore.value.email}</h2>
			</div>
		</div>
		<div class="membership">
			<p>
				Membership level: <b>{toProperCase(accountInfoStore.value.level)}</b>
			</p>
			<p>
				Membership status: <b>{toProperCase(accountInfoStore.value.subscriptionStatus)}</b>
			</p>
		</div>
		<a class="button" href="/account/logout">
			Logout
		</a>
	{/if}
</CenteredLayout>

<style>
	.user-info {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		margin-bottom: 1rem;
		text-align: left;
	}

	.user-info .left {
		display: block;
		aspect-ratio: 1/1;
		border-radius: 10%;
		overflow: hidden;
		border: 2px solid var(--text);
	}

	.right {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.membership {
		text-align: left;
		margin-bottom: 1rem;
	}
</style>