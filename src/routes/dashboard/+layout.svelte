<script lang="ts">
  import Sidebar from "$lib/components/dashboard/Sidebar.svelte";
  import Meta from "$lib/components/Meta.svelte";
  import { page } from "$app/stores";
  import type { PageData } from "./$types";

  let showSidebar = false;

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

<div class="flex h-screen w-full flex-col sm:flex-row">
  <Sidebar {polls} bind:show={showSidebar} />
  <main
    class="flex-grow overflow-y-auto bg-gray-50 sm:flex"
    class:flex={!showSidebar}
    class:hidden={showSidebar}
    class:justify-center={$page.url.pathname === "/dashboard"}>
    <slot />
  </main>
</div>
