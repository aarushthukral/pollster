<script lang="ts">
  import "../style.css";
  import "@fontsource/inter/variable.css";
</script>

<svelte:head>
  <script>
    function setTheme(theme) {
      theme === "dark"
        ? document.documentElement.classList.add("dark")
        : document.documentElement.classList.remove("dark");
      document.documentElement.style.cssText = `color-scheme: ${theme};`;
    }

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
      if (!localStorage.getItem("theme")) {
        setTheme(event.matches ? "dark" : "light");
      }
    });
  </script>
</svelte:head>

<slot />
