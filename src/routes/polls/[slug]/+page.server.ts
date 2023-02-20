import type { PageServerLoad, Actions } from "./$types";
import { polls, votes } from "$lib/server/database";
import { error } from "@sveltejs/kit";
import type { VoteResponse, Poll, Vote } from "$lib/types";
import { getPercentageResults } from "$lib/results";
import { nanoid } from "nanoid";

export const load = (async (event) => {
  const res = await polls.fetch({ slug: event.params.slug }, { limit: 1 });
  if (!res.count) {
    throw error(404, { message: "Couldn't find a poll by that slug" });
  }

  const poll = res.items[0] as Poll;

  if (poll.endsAt && poll.endsAt < Date.now()) {
    const allVotes = (await votes.fetch({ poll: poll.key })).items as Vote[];
    return {
      alreadyVoted: true,
      poll,
      results: getPercentageResults(allVotes, poll),
    };
  }

  if (poll.security === "ipAddress") {
    const ipAddress = event.getClientAddress();
    const allVotes = (await votes.fetch({ poll: poll.key })).items as Vote[];
    const alreadyVoted = allVotes.filter((vote) => vote.ipAddress === ipAddress).length;
    if (alreadyVoted) {
      return {
        alreadyVoted: true,
        poll,
        results: getPercentageResults(allVotes, poll),
      };
    }
  }

  return {
    alreadyVoted: false,
    poll,
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async (event) => {
    const slug = event.params.slug;

    const res = await polls.fetch({ slug }, { limit: 1 });
    if (!res.count) {
      throw error(404, { message: "Couldn't find a poll by that slug" });
    }

    const poll = res.items[0] as Poll;
    const option = (await event.request.formData()).get("option")?.toString();
    if (!option || !poll.options.find((opt) => opt.key === option)) {
      throw error(400, { message: "Invalid option ID" });
    }

    if (poll.endsAt && poll.endsAt < Date.now()) {
      throw error(400, { message: "This poll has already ended" });
    }

    const ipAddress = event.getClientAddress();
    const allVotes = (await votes.fetch({ poll: poll.key })).items as Vote[];

    if (poll.security === "ipAddress") {
      const alreadyVoted = allVotes.filter((vote) => vote.ipAddress === ipAddress).length;
      if (alreadyVoted) {
        throw error(400, { message: "This IP address has already voted in this poll" });
      }
    }

    const newVote: Vote = {
      key: nanoid(),
      poll: poll.key,
      option,
      ipAddress,
      createdAt: Date.now(),
    };

    await votes.put(newVote);

    const results = getPercentageResults([...allVotes, newVote], poll);

    return { voted: true, results } as VoteResponse;
  },
} satisfies Actions;
