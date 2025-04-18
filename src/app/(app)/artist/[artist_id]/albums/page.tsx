import * as Album from "@/components/Album";
import { cache, Fragment } from "react";
import { auth } from "@/auth";
import ky from "ky";
import { ALBUM_URL, withAuthHeader } from "@/hooks/spotify/queries";
import { notFound } from "next/navigation";
import AlbumObjectFull = SpotifyApi.AlbumObjectFull;

const getCurrentAlbum = cache(async (album_id: string) => {
  if (!album_id) return null;
  const session = await auth();
  const response = await ky<AlbumObjectFull>(
    ALBUM_URL(album_id),
    withAuthHeader(session.access_token),
  );
  if (!response.ok) {
    return notFound();
  }
  return await response.json();
});

export default async function ArtistAlbumsPage({ params, searchParams }) {
  const { artist_id } = await params;
  const { album_id } = await searchParams;
  const album = await getCurrentAlbum(album_id);
  if (!artist_id) return null;
  return (
    <Fragment>
      <Album.Details album={album} />
      <Album.List artist_id={artist_id} />
    </Fragment>
  );
}
