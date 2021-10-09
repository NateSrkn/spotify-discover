import { getSession } from "next-auth/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getNowPlaying } from "../../../util/spotify";

export default async function nowPlaying(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
