<script lang="ts">
  import {
    PencilAltIcon,
    TrashIcon,
    CalendarIcon,
    ClockIcon,
    LockClosedIcon,
    UserIcon,
  } from "@rgossiaux/svelte-heroicons/solid";
  import ShareButton from "$lib/components/dashboard/ShareButton.svelte";
  import type { PageData } from "./$types";
  import DeleteModal from "$lib/components/dashboard/DeleteModal.svelte";
  import EditModal from "$lib/components/dashboard/EditModal.svelte";
  import { getRelativeTime } from "$lib/relative-time";

  export let data: PageData;
  $: poll = data.poll;
  $: results = data.results;
  $: percentResults = data.percentResults;
  $: totalVotes = Object.values(data.results)
    .filter((x) => !!x)
    .reduce((a, b) => a + b, 0);

  let isEditModalOpen = false;
  let isDeleteModalOpen = false;
</script>

<EditModal {poll} bind:isOpen={isEditModalOpen} />
<DeleteModal bind:isOpen={isDeleteModalOpen} />

<div class="w-full py-4 px-6">
  <div class="flex flex-wrap items-center justify-center gap-2 sm:justify-end sm:gap-4">
    <ShareButton slug={poll.slug} />
    <button
      on:click={() => (isEditModalOpen = true)}
      class="flex items-center gap-2 rounded-lg bg-black dark:bg-white dark:text-black px-3 py-2 text-white sm:text-lg">
      <PencilAltIcon class="h-6 w-6" /> Edit
    </button>
    <button
      on:click={() => (isDeleteModalOpen = true)}
      class="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-white sm:text-lg">
      <TrashIcon class="h-6 w-6" /> Delete
    </button>
  </div>
  <div class="mt-4 rounded-xl bg-white p-6 dark:bg-black">
    <h2 class="mb-2 text-4xl font-bold sm:text-5xl">{poll.title}</h2>
    {#if poll.description}
      <h3 class="text-xl">{poll.description}</h3>
    {/if}
    <hr class="my-4" />
    <time datetime={new Date(poll.createdAt).toISOString()} class="flex items-center gap-2 text-lg">
      <CalendarIcon class="h-6 w-6" /> Created {getRelativeTime(poll.createdAt)}
    </time>
    {#if poll.endsAt}
      <time datetime={new Date(poll.endsAt).toISOString()} class="flex items-center gap-2 text-lg">
        <ClockIcon class="h-6 w-6" />
        {#if poll.endsAt > Date.now()}
          Ends
        {:else}
          Ended
        {/if}
        {getRelativeTime(poll.endsAt)}
      </time>
    {/if}
    <p class="flex items-center gap-2 text-lg">
      <LockClosedIcon class="h-6 w-6" />
      {#if poll.security === "ipAddress"}
        IP address
      {:else}
        No security
      {/if}
    </p>
    <p class="flex items-center gap-2 text-lg">
      <UserIcon class="h-6 w-6" />
      {totalVotes.toLocaleString()} votes
    </p>
    {#each poll.options as option}
      <div class="mt-4">
        <div class="flex items-end justify-between">
          <h5 class="text-2xl font-medium">{option.title}</h5>
          <p>
            {results[option.key]} votes &middot; {parseFloat(
              percentResults[option.key].toFixed(2)
            )}%
          </p>
        </div>
        <div class="mt-1 h-6 w-full rounded-full bg-gray-100 dark:bg-gray-900">
          <div
            class="h-6 rounded-full bg-gray-300 dark:bg-gray-700"
            style="width: {percentResults[option.key]}%" />
        </div>
      </div>
    {/each}
  </div>
</div>
