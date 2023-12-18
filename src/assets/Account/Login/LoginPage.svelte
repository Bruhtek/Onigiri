<script lang="ts">
	import EmailLogin from "./EmailLogin.svelte";
	import CodeLogin from "./CodeLogin.svelte";
	import { Link, Route, Router } from "svelte-navigator";
</script>

<div class="login-page">
	<Router>
		<Route path="/email">
			<EmailLogin />
		</Route>
		<Route path="/code">
			<CodeLogin />
		</Route>
		<Route>
			<div class="login-home">
				<h2>Login to J-Novel Club to start using the reader!</h2>
				<Link to="/email">Login with Email</Link>
				<Link to="/code">Login with Code</Link>
			</div>
		</Route>
	</Router>
</div>

<style>
	.login-home {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		justify-items: center;
		height: 100%;
		gap: 1em;
	}

	.login-page {
		height: 100%;
		padding: 5px;
	}
</style>