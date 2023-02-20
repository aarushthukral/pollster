import { Deta } from "deta";
import { env } from "$env/dynamic/private";

const deta = Deta(env.DETA_PROJECT_KEY);

const polls = deta.Base("polls");
const votes = deta.Base("votes");

export { polls, votes };
