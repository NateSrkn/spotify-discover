import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { fetcher, spotify } from "../../../util/api";

export const getAlbum = (id: string, session: Session) =>
  id
    ? fetcher(
        {
          url: `albums/${id}`,
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Cache-Control": "s-maxage=3600, stale-while-revalidate",
          },
          params: {
            market: session.user.country,
          },
        },
        spotify
      )
    : {};

export default async function album(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    if (!session) throw res.status(401).json({ message: "Unauthorized" });
    const { query } = req;
    const data = await getAlbum(query.id as string, session);
    res.status(200).json({ ...data });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
