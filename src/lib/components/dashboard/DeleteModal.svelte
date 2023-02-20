<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    DialogDescription,
    Transition,
    TransitionChild,
  } from "@rgossiaux/svelte-headlessui";
  import { TrashIcon } from "@rgossiaux/svelte-heroicons/solid";
  export let isOpen: boolean;
</script>

<Transition appear show={isOpen}>
  <Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" on:close={() => (isOpen = false)}>
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
          action="?/delete"
          use:enhance
          class="my-8 inline-block max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-black">
          <div>
            <DialogTitle as="h3" class="text-center text-3xl font-semibold"
              >Delete Poll</DialogTitle>
            <DialogDescription class="mt-1 text-center"
              >Are you sure you want to delete this poll? This action can't be undone.</DialogDescription>
          </div>
          <div class="mt-8 flex justify-end gap-4">
            <button
              type="button"
              on:click={() => (isOpen = false)}
              class="rounded-lg bg-gray-200 px-3 py-2 text-lg text-black dark:bg-gray-600 dark:text-white"
              >Cancel</button>
            <button
              on:click={async () => {
                isOpen = false;
                await goto("/dashboard");
              }}
              class="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-lg text-white"
              ><TrashIcon class="h-6 w-6" /> Delete</button>
          </div>
        </form>
      </TransitionChild>
    </div>
  </Dialog>
</Transition>
