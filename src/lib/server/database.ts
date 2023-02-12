import { Deta } from "deta";

const projectKey = process.env.DETA_PROJECT_KEY || "project key";

const deta = Deta(projectKey);

const polls = deta.Base("polls");
const votes = deta.Base("votes");

export { polls, votes };
