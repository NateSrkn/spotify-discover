import { getSession } from "next-auth/client";
import { Session } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import { getTopItems } from "../../../util/spotify";

export default async function topItems(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session: Session = await getSession({ req });
    if (!session) throw res.status(401).json({ message: "Unauthorized" });
    const { query } = req;
    const data = await getTopItems(
      { type: query.type, time_range: query.time_range },
      session
    );
    res.status(200).json({ ...data });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
