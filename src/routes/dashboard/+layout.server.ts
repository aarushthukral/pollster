import type { LayoutServerLoad } from "./$types";
import { polls } from "$lib/server/database";
import type { Poll } from "$lib/types";

export const load = (async () => {
  const res = await polls.fetch();
  const allPolls = res.items as Poll[];

  return {
    polls: allPolls.sort((a, b) => b.createdAt - a.createdAt),
  };
}) satisfies LayoutServerLoad;
