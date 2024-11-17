<script lang="ts">
	import { getAccountInfo } from '$lib/api/account.svelte';
	import { onMount } from 'svelte';
	import CenteredLayout from '$lib/components/Layouts/CenteredLayout.svelte';
	import notificationStore from '$lib/stores/notificationStore.svelte';
	import { goto } from '$app/navigation';
	import User from '~icons/ph/user';
	import { toProperCase } from '$lib/helpers/utils';

	let data = $state<Awaited<ReturnType<typeof getAccountInfo>>>();

	let emailHash = $derived.by(() => {
		if (!data) return '';

		const email = data.email.trim().toLowerCase();
		const utf8 = new TextEncoder().encode(email);

		if (!crypto.subtle) {
			return '';
		}

		return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			return hashArray
				.map((bytes) => bytes.toString(16).padStart(2, '0'))
				.join('');
		});
	});

	onMount(async () => {
		const res = await getAccountInfo();
		if (res) {
			data = res;
		} else {
			notificationStore.error('Error loading account data');
			await goto('/');
		}
	});
</script>

<CenteredLayout>
	{#if data}
		<div class="user-info">
			<div class="left">
				{#if emailHash}
					{#await emailHash}
						<User width="64" height="64" />
					{:then hash}
						<img src="https://gravatar.com/avatar/{hash}" alt="User gravatar" />
					{/await}
				{:else}
					<User width="64" height="64" />
				{/if}
			</div>
			<div class="right">
				<h1>{data.username}</h1>
				<h2>{data.email}</h2>
			</div>
		</div>
		<div class="membership">
			<p>
				Membership level: <b>{toProperCase(data.level)}</b>
			</p>
			<p>
				Membership status: <b>{toProperCase(data.subscriptionStatus)}</b>
			</p>
		</div>
		<a class="button" href="/account/logout">
			Logout
		</a>
	{:else}
		<p>Loading...</p>
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