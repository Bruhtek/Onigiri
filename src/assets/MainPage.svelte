<script lang="ts">

	import Navbar from "./Navbar/Navbar.svelte";
	import { Route, Router } from "svelte-navigator";
	import Releases from "./Releases/Releases.svelte";
	import ReaderView from "./Reader/ReaderView.svelte";
	import Series from "./Series/Series.svelte";
	import Settings from "./Settings/Settings.svelte";
</script>

<Router>
	<Route component={ReaderView} path="/reader/:id" />
	<Route path="*">
		<div class="container">
			<Navbar />
			<div class="route-content">
				<Route path="series/*">
					<Series />
				</Route>
				<Route path="settings/*">
					<Settings />
				</Route>
				<Route path="*">
					<Releases />
				</Route>
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