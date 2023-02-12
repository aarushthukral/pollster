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

  export let data: PageData;
  $: poll = data.poll;
  $: pollOptions = data.poll.options;
  let alreadyVoted = data.alreadyVoted;

  export let form: ActionData;
  $: voted = form?.voted || data.alreadyVoted;
  $: results = form?.results || data?.results;

  let selected = "";
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
      {#each pollOptions as option, i}
        <RadioGroupOption class="my-3 sm:my-6" value={option.key} let:checked>
          <div
            class="relative w-full rounded-xl border-2"
            class:border-black={checked}
            class:hover:bg-gray-100={!voted}
            class:cursor-pointer={!voted}>
            {#if results}
              <div
                class="absolute top-0 left-0 -z-10 h-full rounded-r-xl bg-gray-100"
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
    <div class="flex w-full items-center justify-end">
      <button
        class="flex items-center gap-2 rounded-lg bg-black py-2 px-4 text-xl text-white disabled:cursor-not-allowed disabled:opacity-60 sm:px-8 sm:py-4 sm:text-2xl"
        disabled={selected === ""}
        out:fade={{ duration: 300 }}><CheckIcon class="h-8 w-8" /> Vote</button>
    </div>
  {/if}

  <div class="mt-auto">
    {#if !voted && poll.security === "ipAddress"}
      <div
        class="flex flex-col items-center justify-center gap-1.5 text-center sm:flex-row sm:text-start">
        <LockClosedIcon class="h-4 w-4" /> Your IP address will be stored to prevent duplicate responses
      </div>
    {:else}
      {#if alreadyVoted}
        <div class="flex justify-center">You have already voted in this poll</div>
      {/if}
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
