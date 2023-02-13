<script lang="ts">
  import { PlusIcon, ClockIcon } from "@rgossiaux/svelte-heroicons/solid";
  import CreateModal from "./CreateModal.svelte";
  import Logo from "../Logo.svelte";
  import { getRelativeTime } from "$lib/relative-time";

  import { page } from "$app/stores";
  import type { Poll } from "$lib/types";
  $: activeUrl = $page.url.pathname;

  export let polls: Poll[];
  export let show: boolean;
  let isModalOpen = false;
</script>

<div class="flex w-full flex-shrink-0 flex-col bg-white sm:w-72 sm:border-r">
  <div class="flex flex-shrink-0 flex-row items-center justify-between border-b px-6 py-4">
    <div class="flex items-center gap-2">
      <Logo class="h-7 w-7" />
      <h1 class="select-none text-4xl font-bold">Pollster</h1>
    </div>
    <button on:click={() => (show = !show)} class="rounded-lg focus:outline-none sm:hidden">
      <svg fill="currentColor" viewBox="0 0 20 20" class="h-6 w-6">
        <path
          fill-rule="evenodd"
          class:hidden={show}
          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
          clip-rule="evenodd" />
        <path
          fill-rule="evenodd"
          class:hidden={!show}
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd" />
      </svg>
    </button>
  </div>
  <aside
    class="flex-grow pb-4 sm:block sm:overflow-y-auto sm:pb-0"
    class:block={show}
    class:hidden={!show}>
    <div class="flex flex-col justify-between">
      <div>
        {#each polls as poll}
          <div class="my-4 mx-4 flex justify-center">
            <a
              href="/dashboard/{poll.key}"
              on:click={() => (show = false)}
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
</div>
