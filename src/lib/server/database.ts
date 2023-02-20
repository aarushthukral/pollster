import { Deta } from "deta";
import { DETA_PROJECT_KEY as projectKey } from "$env/static/private";

const deta = Deta(projectKey);

const polls = deta.Base("polls");
const votes = deta.Base("votes");

export { polls, votes };
