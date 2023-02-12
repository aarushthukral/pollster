import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import fs from "fs";

export default defineConfig({
  plugins: [sveltekit(), rawFonts([".ttf"])],
});

// Credits to https://geoffrich.net/posts/svelte-social-image
function rawFonts(ext: string[]) {
  return {
    name: "vite-plugin-raw-fonts",
    transform(_code: unknown, id: string) {
      if (ext.some((e) => id.endsWith(e))) {
        const buffer = fs.readFileSync(id);
        return { code: `export default ${JSON.stringify(buffer)}`, map: null };
      }
    },
  };
}
