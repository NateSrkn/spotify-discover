import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getRecentlyPlayed } from "../../../util/spotify";

export default async function recentlyPlayed(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    if (!session) throw res.status(401).json({ message: "Unauthorized" });
    const data = await getRecentlyPlayed(session);
    res.status(200).json({ ...data });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
