<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import { page } from "$app/stores";

  const currentPage = $page.url.pathname.split("/").pop() || "login";
</script>

<main class="h-screen flex flex-col justify-center">
  <Card.Root class="w-6/12 mx-auto">
    <Card.Header>
      <Card.Title>{currentPage}</Card.Title>
    </Card.Header>
    <Card.Content>
      <slot />
    </Card.Content>
  </Card.Root>
</main>
