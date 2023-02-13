<script lang="ts">
  import { enhance } from "$app/forms";
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    Transition,
    TransitionChild,
  } from "@rgossiaux/svelte-headlessui";
  import { PlusIcon, MinusIcon } from "@rgossiaux/svelte-heroicons/solid";
  export let isOpen: boolean;

  let hideDescription = true;
  let optionCount = 2;
  let hideSlug = true;
  let hideExpireAt = true;
  let hideWebhook = true;

  let titleInput: HTMLInputElement;
  let slugInput: HTMLInputElement;
  let webhookInput: HTMLInputElement;
  let optionInputs: HTMLInputElement[] = [];

  function close() {
    isOpen = false;
    setTimeout(() => {
      hideDescription = true;
      optionCount = 2;
      hideSlug = true;
      hideExpireAt = true;
      hideWebhook = true;
    }, 500);
  }

  const timeNow = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    now.setMilliseconds(0);
    now.setSeconds(0);
    return now.toISOString().slice(0, -8);
  };

  let endsAtValue = timeNow();
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
        <DialogOverlay class="fixed inset-0 bg-black bg-opacity-25" />
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
          action="/dashboard"
          use:enhance
          class="my-8 inline-block w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all sm:align-middle">
          <DialogTitle as="h3" class="text-center text-3xl font-semibold">New Poll</DialogTitle>

          <div class="mt-4 grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="title" class="text-md ml-1 block font-medium">Title</label>
              <div>
                <input
                  type="text"
                  name="title"
                  id="title"
                  maxlength="255"
                  required
                  bind:this={titleInput}
                  class="block w-full rounded-md border-gray-300" />
              </div>
            </div>

            {#if hideDescription}
              <button
                type="button"
                on:click={() => (hideDescription = false)}
                class="flex items-center gap-1 font-medium">
                <PlusIcon class="h-4 w-4" />
                Add description
              </button>
            {:else}
              <div class="sm:col-span-2">
                <label for="description" class="text-md ml-1 block font-medium">Description</label>
                <div>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    maxlength="255"
                    class="block w-full rounded-md border-gray-300" />
                </div>
              </div>
            {/if}

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
                    placeholder="Option #{i + 1}"
                    bind:this={optionInputs[i]}
                    class="mt-1 block w-full rounded-md border-gray-300" />
                </div>
              {/each}
              <div class="mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="rounded-lg bg-gray-200 p-2 disabled:cursor-not-allowed disabled:bg-gray-300"
                  disabled={optionCount <= 2}
                  on:click={() => optionCount > 2 && optionCount--}>
                  <MinusIcon class="h-4 w-4" />
                </button>
                <button
                  type="button"
                  class="rounded-lg bg-gray-200 p-2"
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
                  value="none"
                  class="block w-full rounded-md border-gray-300">
                  <option value="none">None</option>
                  <option value="ipAddress">Check IP Address</option>
                </select>
              </div>
            </div>

            {#if hideSlug}
              <button
                type="button"
                on:click={() => (hideSlug = false)}
                class="col-span-1 ml-1 mt-6 flex items-center gap-1 font-medium">
                <PlusIcon class="h-4 w-4" />
                Add custom URL
              </button>
            {:else}
              <div class="col-span-1">
                <label for="slug" class="text-md ml-1 block font-medium">Custom URL</label>
                <div>
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    maxlength="255"
                    bind:this={slugInput}
                    class="block w-full rounded-md border-gray-300" />
                </div>
              </div>
            {/if}

            {#if hideExpireAt}
              <button
                type="button"
                on:click={() => {
                  hideExpireAt = false;
                  endsAtValue = timeNow();
                }}
                class="col-span-1 ml-1 mt-6 flex items-center gap-1 font-medium">
                <PlusIcon class="h-4 w-4" />
                Add end date
              </button>
            {:else}
              <div class="col-span-1">
                <label for="endsAt" class="text-md ml-1 block font-medium">Ends at</label>
                <div>
                  <input
                    type="datetime-local"
                    name="endsAt"
                    id="endsAt"
                    bind:value={endsAtValue}
                    class="block w-full rounded-md border-gray-300" />
                  <input
                    type="hidden"
                    name="endsAtTimestamp"
                    id="endsAtTimestamp"
                    value={new Date(endsAtValue).getTime()} />
                </div>
              </div>
            {/if}

            {#if hideWebhook}
              <button
                type="button"
                on:click={() => (hideWebhook = false)}
                class="col-span-1 ml-1 mt-6 flex items-center gap-1 font-medium">
                <PlusIcon class="h-4 w-4" />
                Add webhook
              </button>
            {:else}
              <div class="col-span-1">
                <label for="webhook" class="text-md ml-1 block font-medium">Webhook</label>
                <div>
                  <input
                    type="url"
                    name="webhook"
                    id="webhook"
                    placeholder="https://example.com/api/poll-results"
                    bind:this={webhookInput}
                    class="block w-full rounded-md border-gray-300" />
                </div>
              </div>
            {/if}
          </div>

          <div class="mt-8 flex justify-end gap-4">
            <button
              type="button"
              on:click={() => close()}
              class="rounded-lg bg-gray-200 px-3 py-2 text-lg text-black">Cancel</button>
            <button
              on:click={() => {
                if (
                  !titleInput.checkValidity() ||
                  !optionInputs
                    .filter((input) => !!input)
                    .every((input) => input.checkValidity()) ||
                  (!hideSlug && !slugInput.checkValidity()) ||
                  (!hideWebhook && !webhookInput.checkValidity())
                ) {
                  return;
                }
                close();
              }}
              class="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-lg text-white">
              <PlusIcon class="h-6 w-6" /> Create
            </button>
          </div>
        </form>
      </TransitionChild>
    </div>
  </Dialog>
</Transition>
