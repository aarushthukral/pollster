<script>
  import { page } from "$app/stores";
  import Logo from "$lib/components/Logo.svelte";
</script>

<svelte:head>
  <title>Error {$page.status} | Pollster</title>
</svelte:head>

<section class="flex h-full items-center p-16">
  <div class="container mx-auto my-8 flex flex-col items-center justify-center px-5">
    <div class="max-w-md text-center">
      <h2 class="mb-6 flex items-center justify-center gap-2 text-6xl font-bold">
        <Logo class="h-12 w-12" /> Pollster
      </h2>
      <h1 class="mb-8 text-9xl font-extrabold">
        <span class="sr-only">Error</span>{$page.status}
      </h1>
      {#if $page.error?.message}
        <p class="text-2xl font-semibold sm:text-3xl">{$page.error.message}</p>
      {/if}
    </div>
  </div>
</section>
