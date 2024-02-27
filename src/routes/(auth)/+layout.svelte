<script lang="ts">
  import '../../app.pcss'
  import * as Card from "$lib/components/ui/card";
  import { page } from "$app/stores";

  const currentPage = $page.url.pathname.split("/").pop() || "login";
</script>

<main class="container mx-auto flex flex-col flex-1 justify-center h-screen">
  <div class="content w-full md:w-10/12 lg:w-6/12 mx-auto">
    <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center mb-12">
      CrowdSPEAK
    </h1>
    <Card.Root>
      <Card.Header>
        <Card.Title>{currentPage}</Card.Title>
      </Card.Header>
      <Card.Content>
        <slot />
      </Card.Content>
    </Card.Root>
  </div>
</main>
