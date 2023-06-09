<script lang="ts">

	import { username } from "../lib/stores/accountStore";
	import Navbar from "./Navbar/Navbar.svelte";
	import { Route, Router } from "svelte-navigator";
	import Releases from "./Releases/Releases.svelte";
	import Reader from "./Reader/Reader.svelte";
	import ReaderView from "./Reader/ReaderView.svelte";
	import Series from "./Series/Series.svelte";
	import AccountInfo from "./Account/AccountInfo.svelte";
</script>

<Router>
	<Route component={ReaderView} path="/reader/:id" />
	<Route path="*">
		<div class="container">
			<Navbar />
			<div class="route-content">
				<Route component={Series} path="series/*" />
				<Route component={AccountInfo} path="account/*" />
				<Route component={Releases} path="*" />
			</div>
		</div>
	</Route>
</Router>

<style>
	.container {
		width: 100%;
		height: 100%;
	}

	.route-content {
		height: calc(100% - 50px);
		width: 100%;
		padding: 20px;
	}
</style>