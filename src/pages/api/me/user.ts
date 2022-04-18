import { getSession } from "next-auth/react";
import { Session } from "next-auth";
import { fetcher, spotify } from "../../../util/api";
import { NextApiRequest, NextApiResponse } from "next";

export const getUser = async (session: Session) => {
  const { data } = await fetcher(
    {
      url: `/me`,
      headers: { Authorization: `Bearer ${session.access_token}` },
    },
    spotify
  );
  return data || {};
};

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session: Session = await getSession({ req });
    if (!session) throw res.status(401).json({ message: "Unauthorized" });
    const data = await getUser(session);
    res.status(200).json({ ...data });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
}
