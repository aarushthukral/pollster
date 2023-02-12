import { polls } from "$lib/server/database";
import { error } from "@sveltejs/kit";
import { nanoid } from "nanoid";
import type { Actions } from "./$types";

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();

    const title = data.get("title")?.toString() || undefined;
    if (!title) {
      throw error(400, { message: "A title for the poll is mandatory" });
    }

    const description = data.get("description")?.toString() || undefined;

    const options = [...new Set(data.getAll("options"))];
    if (options.length < 2) {
      throw error(400, { message: "There should be at least 2 unique options" });
    }

    const security = data.get("security")?.toString() || undefined;
    if (!security || !["none", "ipAddress"].includes(security.toString())) {
      throw error(400, { message: "Invalid security type" });
    }

    const endsAt = data.get("endsAtTimestamp")?.toString() || undefined;

    const webhook = data.get("webhook")?.toString() || undefined;
    if (webhook && !URL_REGEX.test(webhook)) {
      throw error(400, { message: "Invalid webhook URL" });
    }

    const slug = data.get("slug")?.toString() || undefined;
    if (slug) {
      const slugCheck = await polls.fetch({ slug });
      if (slugCheck.count) {
        throw error(409, { message: "This slug is already in use" });
      }
    }

    const key = nanoid(12);

    await polls.put({
      key,
      title,
      description,
      archived: false,
      createdAt: Date.now(),
      options: options.map((opt) => ({ key: nanoid(), title: opt.toString() })),
      security,
      webhook,
      endsAt: endsAt ? parseInt(endsAt) : undefined,
      slug: slug ?? key,
    });
  },
} satisfies Actions;
