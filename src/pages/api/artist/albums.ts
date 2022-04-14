import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { fetcher, spotify } from "../../../util/api";

export const getArtistsAlbums = async (
  id: string,
  params: { [key: string]: any },
  session: Session
) => {
  const data = await fetcher(
    {
      url: `artists/${id}/albums`,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      params: {
        country: session.user.country,
        ...params,
      },
    },
    spotify
  );
  return data;
};

export default async function albums(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });
    if (!session) throw res.status(401).json({ message: "Unauthorized" });
    const { query } = req;
    const { id, ...rest } = query;
    const data = await getArtistsAlbums(id as string, rest, session);
    res.status(200).json({ ...data });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json(error.message);
  }
}
