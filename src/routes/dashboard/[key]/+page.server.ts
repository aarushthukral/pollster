import type { PageServerLoad, Actions } from "./$types";
import { polls, votes } from "$lib/server/database";
import type { Poll, Vote } from "$lib/types";
import { getPercentageResults, getResults } from "$lib/results";
import { error } from "@sveltejs/kit";
import { nanoid } from "nanoid";

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

export const load = (async ({ params }) => {
  const poll = (await polls.get(params.key)) as Poll;
  const allVotes = (await votes.fetch({ poll: poll.key })).items as Vote[];

  return {
    poll,
    results: getResults(allVotes, poll),
    percentResults: getPercentageResults(allVotes, poll),
  };
}) satisfies PageServerLoad;

export const actions = {
  edit: async ({ request, params }) => {
    const poll = (await polls.get(params.key)) as Poll;
    const data = await request.formData();

    const title = data.get("title")?.toString() || undefined;
    if (!title) {
      throw error(400, { message: "A title for the poll is mandatory" });
    }

    const description = data.get("description")?.toString() || undefined;
    if (!description && poll.description) {
      delete poll.description;
    }

    const options = [...new Set(data.getAll("options"))];
    if (options.length < 2) {
      throw error(400, { message: "There should be at least 2 unique options" });
    }

    const security = data.get("security")?.toString() || undefined;
    if (!security || !["none", "ipAddress", "session"].includes(security.toString())) {
      throw error(400, { message: "Invalid security type" });
    }

    const endsAt = data.get("endsAtTimestamp")?.toString() || undefined;

    const webhook = data.get("webhook")?.toString() || undefined;
    if (webhook && !URL_REGEX.test(webhook)) {
      throw error(400, { message: "Invalid webhook URL" });
    }

    const slug = data.get("slug")?.toString() || undefined;
    if (slug && slug !== poll.slug) {
      const slugCheck = await polls.fetch({ slug });
      if (slugCheck.count) {
        throw error(409, { message: "This slug is already in use" });
      }
    }

    const newOptions = options.map((opt) => {
      const oldOption = poll.options.find((o) => o.title === opt);
      return {
        key: oldOption?.key ?? nanoid(),
        title: opt,
      };
    });

    await polls.put(
      assign({}, poll, {
        title,
        description,
        options: newOptions,
        security,
        webhook,
        endsAt: endsAt ? parseInt(endsAt) : undefined,
        slug,
      }),
      poll.key
    );
  },
  delete: async ({ params }) => await polls.delete(params.key),
} satisfies Actions;

const assign = (target: Record<string, unknown>, ...sources: Record<string, unknown>[]) =>
  Object.assign(
    target,
    ...sources.map((x) =>
      Object.fromEntries(Object.entries(x).filter(([, value]) => value !== undefined))
    )
  );
