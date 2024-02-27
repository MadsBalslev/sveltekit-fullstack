<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Github } from "lucide-svelte";
  import { goto } from "$app/navigation";

  type Provider = "github";

  export let provider: Provider;

  let submitting = false;

  const handleClick = async () => {
    submitting = true;
    try {
      await goto(`/login/${provider}`);
    } catch (error) {
      console.error(error);
    } finally {
      submitting = false;
    }
  };
</script>

<Button variant="secondary" class="w-full" on:click={handleClick} disabled={submitting}>
  <Github class="mr-2 h-4 w-4" />
  Continue with {provider}
</Button>
