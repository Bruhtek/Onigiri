<script lang="ts">
	import Navbar from "./Navbar/Navbar.svelte";
	import { Route, Router } from "svelte-routing";
	import Releases from "./Releases/Releases.svelte";
	import ReaderView from "./Reader/ReaderView.svelte";
	import Series from "./Series/Series.svelte";
	import Settings from "./Settings/Settings.svelte";
	import SeriesInfo from "./Series/SeriesInfo/SeriesInfo.svelte";

	const navItems = {
		"/": "Releases",
		"/series": "Series",
		"/settings": "Settings"
	}
</script>

<Router>
	<Route path="/reader/*">
		<Router>
			<Route path=":id" let:params>
				<ReaderView partId={params.id} />
			</Route>
			<Route path=":id/:progress" let:params>
				<ReaderView partId={params.id} externalProgress={params.progress} />
			</Route>
		</Router>
	</Route>
	<Route path="series/:seriesId/*" let:params>
		<SeriesInfo seriesId={params.seriesId} />
	</Route>
	<Route path="*">
		<div class="container">
			<Navbar items={navItems} />
			<div class="route-content">
				<Router>
					<Route path="series/*">
						<Series />
					</Route>
					<Route path="settings/*">
						<Settings />
					</Route>
					<Route path="*">
						<Releases />
					</Route>
				</Router>
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
		/*padding: 20px;*/
	}
</style>