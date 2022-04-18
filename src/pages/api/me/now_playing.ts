import { getSession } from "next-auth/react";

import { NextApiRequest, NextApiResponse } from "next";
import { fetcher, spotify } from "../../../util/api";

export const getNowPlaying = async (session) => {
  const data = await fetcher(
    {
      url: "/me/player/currently-playing",
      headers: { Authorization: `Bearer ${session.access_token}` },
      useCache: false,
    },
    spotify
  );
  if (!data || data.currently_playing_type === "episode") {
    return {
      isListening: false,
    };
  }
  return data;
};

export default async function nowPlaying(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    if (!session) throw res.status(401).json({ message: "Unauthorized" });
    const data = await getNowPlaying(session);
    res.status(200).json({ ...data });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
