<script lang="ts">
	import { changeReleasesPage, releasesPageProperties } from '$lib/api/releases.svelte';

	import ArrowRight from '~icons/ph/arrow-right';
	import ArrowLeft from '~icons/ph/arrow-left';
	import Star from '~icons/ph/star';
	import StarFill from '~icons/ph/star-fill';
	import { loggedIn } from '$lib/api/account.svelte';
	import IconCheckbox from '$lib/components/Inputs/IconCheckbox.svelte';
	import releasesPreferencesStore, { changeFavoritesOnly } from '$lib/stores/releasesPreferencesStore.svelte';
</script>

<div class="bottom-bar">
	<div class="left">
		{#if loggedIn() && releasesPreferencesStore.value.favoritesOnly}
			Releases (Only followed)
		{:else}
			Releases
		{/if}
	</div>
	<div class="page-data">
		<button class="button-left" onclick={() => changeReleasesPage(-1)}>
			<ArrowLeft width="32" height="32" />
		</button>
		<span>{releasesPageProperties.value.page + 1}</span>
		<button class="button-right" onclick={() => changeReleasesPage(1)}>
			<ArrowRight width="32" height="32" />
		</button>
	</div>
	<div class="right">
		{#if loggedIn()}
			<IconCheckbox
				current={releasesPreferencesStore.value.favoritesOnly}
				onChange={changeFavoritesOnly}
			>
				{#snippet stateOn()}
					<StarFill width="32px" height="32px" />
				{/snippet}
				{#snippet stateOff()}
					<Star width="32px" height="32px" />
				{/snippet}
			</IconCheckbox>
		{/if}
	</div>
</div>

<style>
	.bottom-bar {
		display: flex;
		height: 3rem;
		place-content: center;
		position: relative;
	}

	.bottom-bar .right, .left {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
	}

	.right {
		right: 1rem;
	}

	.left {
		left: 1rem;
	}

	.page-data {
		display: flex;
		align-items: center;
		align-content: center;
		gap: 1rem;
	}

	span {
		font-size: 1.3rem;
		padding-bottom: 0.2rem;
	}
</style>