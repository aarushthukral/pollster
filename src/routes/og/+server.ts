import type { RequestHandler } from "./$types";
import satori from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import Inter from "$lib/Inter.ttf";

const width = 1200;
const height = 630;

export const GET = (async ({ url }) => {
  const title = url.searchParams.get("title");
  const description = url.searchParams.get("description") ?? "";

  if (!title) {
    return new Response(JSON.stringify({ message: "Title is missing" }), { status: 400 });
  }

  const markup = html`
    <div tw="flex flex-col bg-white h-full w-full py-8 px-12">
      <div tw="flex items-center">
        <svg fill="none" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" tw="w-11 h-11">
          <rect
            transform="rotate(90 244.56 31)"
            x="244.56"
            y="31"
            width="128.72"
            height="244.56"
            fill="black" />
          <rect
            transform="rotate(90 512 191.18)"
            x="512"
            y="191.18"
            width="128.72"
            height="512"
            fill="black" />
          <rect
            transform="rotate(90 368.98 351.36)"
            x="368.98"
            y="351.36"
            width="128.72"
            height="368.98"
            fill="black" />
        </svg>
        <h2 tw="text-6xl ml-4">Pollster</h2>
      </div>
      <div tw="flex flex-col mt-12">
        <h1 tw="text-${title.length > 55 ? 7 : 8}xl">${title}</h1>
        <p tw="text-2xl">${description}</p>
      </div>
      <div tw="flex items-center bg-black rounded-lg text-3xl text-white px-8 py-4 mt-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white" tw="w-8 h-8 mr-2">
          <path
            fill-rule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clip-rule="evenodd" />
        </svg>
        Vote
      </div>
    </div>
  `;

  const svg = await satori(markup, {
    width,
    height,
    fonts: [
      {
        name: "Inter Latin",
        data: Buffer.from(Inter),
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: width,
    },
  });

  const image = resvg.render();

  return new Response(image.asPng(), {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, immutable, no-transform, max-age=31536000",
    },
  });
}) satisfies RequestHandler;
