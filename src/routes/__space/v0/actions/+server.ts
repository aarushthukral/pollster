import { polls, votes } from "$lib/server/database";
import type { DetaEvent, Poll, Vote } from "$lib/types";
import type { RequestHandler } from "./$types";

const ONE_HOUR = 60 * 60 * 1000;

export const POST = (async ({ request }) => {
  const { event }: { event: DetaEvent } = await request.json();

  if (event.id !== "webhooks") {
    return new Response(JSON.stringify({ message: "Invalid event ID" }), { status: 400 });
  }

  const timeNow = Date.now();
  const pollsRes = await polls.fetch({ "endsAt?r": [timeNow - ONE_HOUR, timeNow] });
  const allPolls = pollsRes.items as Poll[];

  const query = allPolls.map(({ key }) => ({ poll: key }));
  const votesRes = await votes.fetch(query);
  const allVotes = votesRes.items as Vote[];

  const requests = [];

  for (const poll of allPolls) {
    if (poll.webhook) {
      const results = getResults(
        allVotes.filter((vote) => vote.poll === poll.key),
        poll
      );

      requests.push(
        fetch(poll.webhook, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ poll, results }),
        })
      );
    }
  }

  await Promise.all(requests);

  return new Response(null, { status: 200 });
}) satisfies RequestHandler;

function getResults(votes: Vote[], poll: Poll) {
  const result: Record<string, number> = {};

  poll.options.forEach((option) => {
    result[option.key] = 0;
  });

  return votes.reduce((acc, vote) => {
    acc[vote.option] += 1;
    return acc;
  }, result);
}
