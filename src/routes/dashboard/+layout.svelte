<script lang="ts">
  import Sidebar from "$lib/components/dashboard/Sidebar.svelte";
  import Meta from "$lib/components/Meta.svelte";
  import { page } from "$app/stores";
  import type { PageData } from "./$types";

  export let data: PageData;
  $: polls = data.polls;
</script>

<svelte:head>
  <Meta
    title="Dashboard | Pollster"
    description="Make every voice count, with polls that matter."
    ogImage="{$page.url.origin}/og.png"
    url="{$page.url.origin}/dashboard" />
</svelte:head>

<div class="grid h-screen grid-cols-4 overflow-hidden bg-gray-50 xl:grid-cols-5">
  <Sidebar {polls} />
  <main class="col-span-3 overflow-y-auto xl:col-span-4">
    <slot />
  </main>
</div>
