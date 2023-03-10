<script lang="ts">
  import { CheckIcon } from "@rgossiaux/svelte-heroicons/outline";
  import { LockClosedIcon } from "@rgossiaux/svelte-heroicons/solid";
  import {
    RadioGroup,
    RadioGroupDescription,
    RadioGroupLabel,
    RadioGroupOption,
  } from "@rgossiaux/svelte-headlessui";
  import type { PageData, ActionData } from "./$types";
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { fade } from "svelte/transition";
  import Meta from "$lib/components/Meta.svelte";
  import { onMount } from "svelte";

  export let data: PageData;
  $: poll = data.poll;

  export let form: ActionData;
  $: voted = form?.voted || data.alreadyVoted;
  $: results = form?.results || data.results;

  let selected = "";

  onMount(() => {
    if (poll?.security === "session" && localStorage.getItem(`p:${poll.key}`)) {
      voted = true;
    }
  });
</script>

<svelte:head>
  <Meta
    title="{poll.title} | Pollster"
    description={poll.description || "Make every voice count, with polls that matter."}
    ogImage="{$page.url.origin}/og?title={encodeURIComponent(
      poll.title
    )}&description={encodeURIComponent(poll.description ?? '')}"
    url="{$page.url.origin}/polls/{poll.slug}" />
</svelte:head>

<form method="POST" class="flex min-h-screen flex-col p-8 sm:p-16" use:enhance>
  <RadioGroup value={selected} on:change={(e) => !voted && (selected = e.detail)}>
    <RadioGroupLabel class="text-4xl font-bold sm:text-7xl">{poll.title}</RadioGroupLabel>
    {#if poll.description}
      <RadioGroupDescription class="mt-4 text-xl">{poll.description}</RadioGroupDescription>
    {/if}
    <div class="mt-6 mb-3 sm:mb-6 sm:mt-12">
      {#each data.poll.options as option, i}
        <RadioGroupOption class="my-3 sm:my-6" value={option.key} let:checked>
          <div
            class="relative w-full rounded-xl border-2 dark:border-gray-700"
            class:border-black={checked}
            class:hover:bg-gray-100={!voted}
            class:dark:hover:bg-gray-800={!voted}
            class:cursor-pointer={!voted}>
            {#if voted}
              <div
                class="absolute top-0 left-0 -z-10 h-full rounded-r-xl bg-gray-100 dark:bg-gray-800"
                style="width: {results[option.key]}%"
                in:fade={{ duration: 300, delay: i * 300 }} />
              <div
                class="absolute top-1/2 right-3 -translate-y-1/2 text-xl sm:right-6 sm:text-2xl"
                in:fade={{ duration: 300, delay: i * 300 + 100 }}>
                {parseFloat(results[option.key].toFixed(2))}%
              </div>
            {/if}
            <div
              class="flex w-[80%] items-center gap-1 px-3 py-2 text-xl font-semibold sm:gap-2 sm:px-6 sm:py-4 sm:text-2xl">
              {option.title}
              {#if checked}
                <CheckIcon class="h-6 w-6" />
              {/if}
            </div>
          </div>
        </RadioGroupOption>
      {/each}
    </div>
    <input class="hidden" name="option" type="text" value={selected} />
  </RadioGroup>

  {#if !voted}
    <div
      class="mt-2 flex w-full flex-col items-end justify-end gap-3 sm:flex-row sm:items-center sm:gap-8">
      <button on:click={() => (voted = true)} class="text-xl sm:text-2xl">Show Results</button>
      <button
        class="flex items-center gap-2 rounded-lg bg-black py-2 px-4 text-xl text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black sm:px-8 sm:py-4 sm:text-2xl"
        disabled={selected === ""}
        on:click={() => {
          if (poll.security === "session") {
            localStorage.setItem(`p:${poll.key}`, "voted");
          }
        }}><CheckIcon class="h-8 w-8" /> Vote</button>
    </div>
  {/if}

  <div class="mt-auto">
    {#if !voted && poll.security === "ipAddress"}
      <div
        class="flex flex-col items-center justify-center gap-1.5 text-center sm:flex-row sm:text-start">
        <LockClosedIcon class="h-4 w-4" /> Your IP address will be stored to prevent duplicate responses
      </div>
    {:else}
      <div class="flex justify-center gap-1">
        Powered by
        <a
          href="https://github.com/aarushthukral/pollster"
          target="_blank"
          rel="noreferrer"
          class="font-semibold">
          Pollster
        </a>
      </div>
    {/if}
  </div>
</form>
