import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { Options, PagingObject, SimpleArtist, SimpleTrack } from "../../../util/types/spotify";
import { fetcher, spotify } from "../../../util/api";

export const getTopItems = (
  type: Options["type"],
  time_range: Options["time_range"],
  session: Session
) =>
  fetcher<PagingObject<SimpleArtist | SimpleTrack>>(
    {
      url: `me/top/${type}`,
      params: { time_range },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    },
    spotify
  );

export default async function topItems(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session: Session = await getSession({ req });
    if (!session) throw res.status(401).json({ message: "Unauthorized" });
    const { query } = req;
    const data = await getTopItems(query.type, query.time_range, session);
    res.status(200).json({ ...data });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
