import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { getArtistData } from "../../util/spotify";

export default async function artist(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req });
    if (!session) throw res.status(401).json({ message: "Unauthorized" });
    const { query } = req;
    const data = await getArtistData(query.id, session);
    res.status(200).json({ ...data });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
