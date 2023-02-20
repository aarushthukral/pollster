<script lang="ts">
  import { browser } from "$app/environment";
  import { SunIcon, MoonIcon } from "@rgossiaux/svelte-heroicons/solid";

  let isDark = false;
  if (browser) {
    isDark = document.documentElement.classList.contains("dark");
  }

  function toggleTheme() {
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.classList.toggle("dark");
    document.documentElement.style.cssText = `color-scheme: ${newTheme};`;
    localStorage.setItem("theme", newTheme);
    isDark = !isDark;
  }
</script>

<button
  class="rounded-lg bg-gray-100 p-2 hover:bg-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800"
  on:click={() => toggleTheme()}
  data-toggle-theme>
  {#if isDark}
    <SunIcon class="h-6 w-6" />
  {:else}
    <MoonIcon class="h-6 w-6" />
  {/if}
</button>
