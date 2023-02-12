<script>
  import { page } from "$app/stores";
</script>

<div class="flex min-h-screen flex-col items-center">
  {#if $page.error}
    <p class="max-w-sm text-center text-2xl">{$page.error.message}</p>
  {/if}
</div>
