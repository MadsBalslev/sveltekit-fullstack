<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if data.user}
  <h1>Hello!</h1>
  <p>You are signed in as {data.user.email}</p>
  <form method="post" use:enhance>
    <button>Sign out</button>
  </form>
{:else}
  <p>You are not signed in</p>
{/if}

