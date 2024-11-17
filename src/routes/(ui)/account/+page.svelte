<script lang="ts">
	import { onMount } from 'svelte';
	import CenteredLayout from '$lib/components/Layouts/CenteredLayout.svelte';
	import notificationStore from '$lib/stores/notificationStore.svelte';
	import { goto } from '$app/navigation';
	import User from '~icons/ph/user';
	import { toProperCase } from '$lib/helpers/utils';
	import { z } from 'zod';
	import { jfetch } from '$lib/api/jnovel.svelte';

	let data = $state<z.infer<typeof accountInfoSchema>>();

	export const accountInfoSchema = z
		.object({
			id: z.string(),
			email: z.string(),
			username: z.string(),
			country: z.string(),
			created: z.string().datetime(),
			level: z.string(),
			subscriptionStatus: z.string(),
		})
		.optional();

	export const getAccountInfo = async (): Promise<z.infer<typeof accountInfoSchema>> => {
		const res = await jfetch('/me');

		if (!res.ok) {
			console.error('Error getting account info - ', res.status);
			return;
		}

		try {
			const json = await res.json();
			return accountInfoSchema.parse(json);
		} catch (err) {
			console.error('Error getting account info - ', err);
			return;
		}
	};


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