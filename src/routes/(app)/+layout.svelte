<script lang="ts">
	import '../../app.pcss';
	import Navbar from '$lib/components/custom/Navbar.svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex min-h-screen flex-col">
	<Navbar>
		<div slot="start">
			<h2
				class="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
			>
				CrowdSPEAK
			</h2>
		</div>
		<div class="user-controls">
			<form method="post">
				<Button variant="secondary" href="/signout">Sign out</Button>
			</form>
		</div>
	</Navbar>

	<main class="container flex flex-1 flex-col pt-10">
		<slot />
	</main>
</div>
