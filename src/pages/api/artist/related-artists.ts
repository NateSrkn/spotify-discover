import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { fetcher, spotify } from "../../../util/api";

export const getRelatedArtists = async (id: string, session: Session) => {
  const data = await fetcher(
    {
      url: `artists/${id}/related-artists`,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    },
    spotify
  );
  return data;
};

export default async function relatedArtists(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    if (!session) throw res.status(401).json({ message: "Unauthorized" });
    const { query } = req;
    const data = await getRelatedArtists(query.id as string, session);
    res.setHeader("Cache-Control", "max-age=3600");
    res.status(200).json({ ...data });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json(error.message);
  }
}
