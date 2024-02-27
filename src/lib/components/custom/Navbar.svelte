<script lang="ts">
	import { cn } from "$lib/utils";

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<nav class={cn("flex justify-between items-center space-x-4 lg:space-x-6 py-2 px-5", className)}>
  <slot name="start">
    <div  />
  </slot>
  <slot name="center">
    <div />
  </slot>
  <slot />
</nav>
