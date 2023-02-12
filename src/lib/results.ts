import type { Poll, Vote } from "./types";

export const getResults = (votes: Vote[], poll: Poll) => {
  const result: Record<string, number> = {};

  poll.options.forEach((option) => {
    result[option.key] = 0;
  });

  return votes.reduce((acc, vote) => {
    acc[vote.option] += 1;
    return acc;
  }, result);
};

export const getPercentageResults = (votes: Vote[], poll: Poll) => {
  const result: Record<string, number> = {};

  poll.options.forEach((option) => {
    result[option.key] = 0;
  });

  const totalVotes = votes.length || 1;

  votes.forEach((vote) => {
    result[vote.option] += 1;
  });

  Object.keys(result).forEach((option) => {
    result[option] = (result[option] / totalVotes) * 100;
  });

  return result;
};
