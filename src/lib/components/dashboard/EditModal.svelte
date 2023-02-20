<script lang="ts">
  import { enhance } from "$app/forms";
  import type { Poll } from "$lib/types";
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    Transition,
    TransitionChild,
  } from "@rgossiaux/svelte-headlessui";
  import { PlusIcon, MinusIcon, CheckIcon } from "@rgossiaux/svelte-heroicons/solid";
  export let isOpen: boolean;
  export let poll: Poll;

  $: optionCount = poll.options.length;
  let titleInput: HTMLInputElement;
  let webhookInput: HTMLInputElement;
  let slugInput: HTMLInputElement;
  let optionInputs: HTMLInputElement[] = [];

  function close() {
    isOpen = false;
    setTimeout(() => {
      optionCount = poll.options.length;
    }, 500);
  }

  const getTime = (time: number) => {
    const date = new Date(time);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    date.setMilliseconds(0);
    date.setSeconds(0);
    return date.toISOString().slice(0, -8);
  };

  let endsAtValue: string;
  $: endsAtValue = poll.endsAt ? getTime(poll.endsAt) : "";

  const handleEndsAtInputChange = (e: Event) =>
    (endsAtValue = (e.target as HTMLInputElement).value);
</script>

<Transition appear show={isOpen}>
  <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" on:close={() => close()}>
    <div class="min-h-screen px-4 text-center">
      <TransitionChild
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0">
        <DialogOverlay class="fixed inset-0 bg-black bg-opacity-25 backdrop-blur" />
      </TransitionChild>

      <TransitionChild
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95">
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
          &#8203;
        </span>

        <form
          method="POST"
          action="?/edit"
          use:enhance
          class="my-8 inline-block w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-black">
          <DialogTitle as="h3" class="text-center text-3xl font-semibold">Edit Poll</DialogTitle>

          <div class="mt-4 grid gap-y-4 gap-x-6 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="title" class="text-md ml-1 block font-medium">Title</label>
              <div>
                <input
                  type="text"
                  name="title"
                  id="title"
                  maxlength="255"
                  value={poll.title}
                  required
                  bind:this={titleInput}
                  class="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900" />
              </div>
            </div>

            <div class="sm:col-span-2">
              <label for="description" class="text-md ml-1 block font-medium">Description</label>
              <div>
                <input
                  type="text"
                  name="description"
                  id="description"
                  maxlength="255"
                  value={poll.description ?? ""}
                  placeholder="Optional"
                  class="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900" />
              </div>
            </div>

            <div class="sm:col-span-2">
              <label for="options" class="text-md ml-1 block font-medium">Options</label>
              {#each Array(optionCount) as _, i}
                <div>
                  <input
                    type="text"
                    name="options"
                    id="options"
                    required
                    maxlength="255"
                    value={poll.options[i]?.title ?? ""}
                    placeholder="Option #{i + 1}"
                    bind:this={optionInputs[i]}
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900" />
                </div>
              {/each}
              <div class="mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="rounded-lg bg-gray-200 p-2 disabled:cursor-not-allowed disabled:bg-gray-300 dark:bg-gray-700 dark:disabled:bg-gray-800"
                  disabled={optionCount <= 2}
                  on:click={() => optionCount > 2 && optionCount--}>
                  <MinusIcon class="h-4 w-4" />
                </button>
                <button
                  type="button"
                  class="rounded-lg bg-gray-200 p-2 dark:bg-gray-700"
                  on:click={() => optionCount++}>
                  <PlusIcon class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Due to limitations with Deta, security can only be set to none. -->
            <div class="col-span-1 hidden">
              <label for="security" class="text-md ml-1 block font-medium">Security</label>
              <div>
                <select
                  name="security"
                  id="security"
                  value={poll.security}
                  class="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900">
                  <option value="none">None</option>
                  <option value="ipAddress">Check IP Address</option>
                </select>
              </div>
            </div>

            <div class="col-span-1">
              <label for="slug" class="text-md ml-1 block font-medium">Custom URL</label>
              <div>
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  value={poll.slug}
                  maxlength="255"
                  required
                  bind:this={slugInput}
                  class="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900" />
              </div>
            </div>

            <div class="col-span-1">
              <label for="endsAt" class="text-md ml-1 block font-medium">Ends at</label>
              <div>
                <input
                  type="datetime-local"
                  name="endsAt"
                  id="endsAt"
                  value={endsAtValue}
                  on:input={handleEndsAtInputChange}
                  class="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900" />
                <input
                  type="hidden"
                  name="endsAtTimestamp"
                  id="endsAtTimestamp"
                  value={endsAtValue !== "" ? new Date(endsAtValue).getTime() : ""} />
              </div>
            </div>

            <div class="col-span-1">
              <label for="webhook" class="text-md ml-1 block font-medium">Webhook</label>
              <div>
                <input
                  type="url"
                  name="webhook"
                  id="webhook"
                  placeholder="https://example.com/api/poll-results"
                  value={poll.webhook ?? ""}
                  bind:this={webhookInput}
                  class="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900" />
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-end gap-4">
            <button
              type="button"
              on:click={() => close()}
              class="rounded-lg bg-gray-200 px-3 py-2 text-lg text-black dark:bg-gray-600 dark:text-white"
              >Cancel</button>
            <button
              on:click={() => {
                if (
                  !titleInput.checkValidity() ||
                  !optionInputs
                    .filter((input) => !!input)
                    .every((input) => input.checkValidity()) ||
                  !slugInput.checkValidity() ||
                  (webhookInput.value !== "" && !webhookInput.checkValidity())
                ) {
                  return;
                }
                close();
              }}
              class="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-lg text-white dark:bg-white dark:text-black">
              <CheckIcon class="h-6 w-6" /> Save
            </button>
          </div>
        </form>
      </TransitionChild>
    </div>
  </Dialog>
</Transition>
