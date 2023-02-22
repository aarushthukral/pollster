<script lang="ts">
  import { ChartBarIcon } from "@rgossiaux/svelte-heroicons/outline";
  import Meta from "$lib/components/Meta.svelte";
  import { page } from "$app/stores";
  import AwardIcon from "$lib/components/AwardIcon.svelte";
  import GitHubIcon from "$lib/components/GitHubIcon.svelte";
  import Logo from "$lib/components/Logo.svelte";
</script>

<svelte:head>
  <Meta
    title="Pollster"
    description="Make every voice count, with polls that matter."
    ogImage="{$page.url.origin}/og.png"
    url={$page.url.origin} />
</svelte:head>

<main class="flex min-h-screen flex-col">
  <div class="my-auto flex flex-col items-center">
    <p class="inline-flex items-center gap-1.5 text-xl">
      Deta Shipathon 2023 <AwardIcon class="h-5 w-5" /> <span class="font-medium">Best App</span>
    </p>
    <div class="mt-3 flex items-center gap-4">
      <Logo class="h-12 w-12 sm:h-20 sm:w-20" />
      <h1 class="select-none text-center text-6xl font-bold sm:text-8xl">Pollster</h1>
    </div>
    <div class="mt-3 sm:mt-6">
      <p class="text-center text-2xl sm:text-3xl">
        Make every voice count, <br />with polls that matter.
      </p>
    </div>
    <div class="mt-8 flex gap-4">
      <a
        href="/dashboard"
        class="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-lg text-white dark:bg-white dark:text-black">
        <ChartBarIcon class="h-6 w-6" />
        Dashboard
      </a>
      <a
        href="https://github.com/aarushthukral/pollster"
        target="_blank"
        rel="noreferrer"
        class="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-lg text-white dark:bg-white dark:text-black">
        <GitHubIcon class="h-6 w-6" />
        GitHub
      </a>
    </div>
  </div>
</main>
