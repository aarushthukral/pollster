<script lang="ts">
  import { Popover, PopoverButton, PopoverPanel, Transition } from "@rgossiaux/svelte-headlessui";
  import { ShareIcon, CheckIcon } from "@rgossiaux/svelte-heroicons/solid";
  import { ClipboardCopyIcon } from "@rgossiaux/svelte-heroicons/outline";

  export let slug: string;
  let inputBox: HTMLInputElement;
  let copied = false;
</script>

<Popover class="relative" let:open>
  <PopoverButton
    class="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-white dark:bg-white dark:text-black sm:text-lg">
    <ShareIcon class="h-6 w-6" /> Share
  </PopoverButton>
  <Transition
    enter="transition ease-out duration-200"
    enterFrom="opacity-0 translate-y-1"
    enterTo="opacity-100 translate-y-0"
    leave="transition ease-in duration-150"
    leaveFrom="opacity-100 translate-y-0"
    leaveTo="opacity-0 translate-y-1">
    <PopoverPanel
      class="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/4 transform px-4 sm:-translate-x-1/2 sm:px-0">
      <div
        class="overflow-hidden rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-lg dark:border-gray-800 dark:bg-black">
        <p class="text-md font-medium">Use the link below to share your poll:</p>
        <div class="mt-1 flex h-8 w-full">
          <input
            type="text"
            class="flex-grow rounded-l-lg border border-gray-300 px-2 dark:border-gray-700 dark:bg-gray-900"
            readonly={true}
            bind:this={inputBox}
            on:click={() => inputBox.select()}
            value={window.location.origin + "/polls/" + slug} />
          <button
            on:click={() => {
              copied = true;
              navigator.clipboard.writeText(window.location.origin + "/polls/" + slug);
              setTimeout(() => (copied = false), 1000);
            }}
            class:bg-gray-300={copied}
            class="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-r-lg border border-l-0 border-gray-300 bg-gray-200 p-1 dark:border-gray-700 dark:bg-gray-800">
            {#if !copied}
              <ClipboardCopyIcon />
            {:else}
              <CheckIcon />
            {/if}
          </button>
        </div>
      </div>
    </PopoverPanel>
  </Transition>
</Popover>
