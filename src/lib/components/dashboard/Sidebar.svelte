<script lang="ts">
  import { PlusIcon, ClockIcon } from "@rgossiaux/svelte-heroicons/solid";
  import CreateModal from "./CreateModal.svelte";
  import Logo from "../Logo.svelte";
  import { getRelativeTime } from "$lib/relative-time";

  import { page } from "$app/stores";
  import type { Poll } from "$lib/types";
  $: activeUrl = $page.url.pathname;

  export let polls: Poll[];
  let isModalOpen = false;
</script>

<aside class="sticky top-0 max-h-screen overflow-y-auto overflow-x-hidden bg-white shadow-md">
  <div class="flex flex-col justify-between">
    <div class="flex items-center justify-between border-b px-6 py-4">
      <div class="flex items-center gap-2">
        <Logo class="h-7 w-7" />
        <h1 class="select-none text-4xl font-bold">Pollster</h1>
      </div>
    </div>
    <div>
      {#each polls as poll}
        <div class="my-4 mx-4 flex justify-center">
          <a
            href="/dashboard/{poll.key}"
            class="w-full rounded-lg border-2 px-6 py-4 hover:bg-gray-100"
            class:border-black={activeUrl === "/dashboard/" + poll.key}>
            <h2>{poll.title}</h2>
            {#if poll.endsAt}
              <p class="mt-2 flex items-center gap-1">
                <ClockIcon class="h-5 w-5" />
                {#if poll.endsAt > Date.now()}
                  Ends
                {:else}
                  Ended
                {/if}
                {getRelativeTime(poll.endsAt)}
              </p>
            {/if}
          </a>
        </div>
      {/each}
      <div class="my-4 mx-4 flex justify-center">
        <CreateModal bind:isOpen={isModalOpen} />
        <button
          on:click={() => (isModalOpen = true)}
          class="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dotted px-6 py-4 hover:border-solid hover:bg-gray-100">
          <PlusIcon class="h-5 w-5" /> Create new poll
        </button>
      </div>
    </div>
  </div>
</aside>
