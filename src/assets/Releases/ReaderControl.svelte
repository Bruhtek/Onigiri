<script lang="ts">
	import { ArrowLeftIcon } from "svelte-feather-icons";
	import { useNavigate } from "svelte-navigator";

	const navigate = useNavigate();

	function goBack() {
		navigate(-1);
	}
</script>

<div class="reader-controls" on:click|stopPropagation={() => {}}>
	<div class="button" on:click={goBack}>
		<ArrowLeftIcon size="2x" />
	</div>
</div>

<style>
	.reader-controls {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 150px;
		background: #fff;
		border-bottom: 3px solid #000;
		border-top: 3px solid #000;
		z-index: 100;
	}
</style>