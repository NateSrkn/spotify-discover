import { notFound } from "next/navigation";
import { cache } from "react";
import { auth } from "@/auth";
import ky from "ky";
import { ARTIST_URL, withAuthHeader } from "@/hooks/spotify/queries";
import ArtistObjectFull = SpotifyApi.ArtistObjectFull;
import { ArtistLayout as ArtistPage } from "@/components/ArtistLayout";
import Link from "next/link";
import React from "react";
import * as Artist from "@/components/Artist";
import { ExpandableList } from "@/components/ExpandableList";

const tabs = [
  { name: "Top Tracks", href: "./" },
  { name: "Albums", href: "albums" },
] as const;

const getSimilarArtists = cache(async (id: string) => {
  const session = await auth();
  const response = await ky<{
    artists: ArtistObjectFull[];
  }>(`${ARTIST_URL(id)}/related-artists`, withAuthHeader(session.access_token));
  return await response.json();
});

const getCurrentArtist = cache(async (id: string) => {
  const session = await auth();
  const response = await ky<ArtistObjectFull>(
    ARTIST_URL(id),
    withAuthHeader(session.access_token),
  );
  if (!response.ok) {
    notFound();
  }
  return await response.json();
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ artist_id: string }>;
}) {
  const { artist_id } = await params;
  const artist = await getCurrentArtist(artist_id);
  return {
    title: `Artist | ${artist.name}`,
  };
}

export default async function ArtistLayout({ children, params }) {
  const { artist_id } = await params;
  const [artist, similar] = await Promise.all([
    getCurrentArtist(artist_id),
    getSimilarArtists(artist_id),
  ]);

  return (
    <div className="min-h-screen bg-primary-green rounded-2xl">
      <ArtistPage artist={artist} />
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <section className="flex flex-col gap-4 p-4 col-span-2">
          <nav className="flex gap-2 border-b border-pewter-blue pb-2">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={`/artist/${artist_id}/${tab.href}`}
                className="font-bold"
              >
                {tab.name}
              </Link>
            ))}
          </nav>
          {children}
        </section>
        <section className="flex flex-col gap-4 p-4">
          <h6 className="font-bold border-b border-pewter-blue pb-2">
            Similar Artists
          </h6>
          <ExpandableList>
            {similar.artists.map((artist) => (
              <Artist.Root artist={artist} key={artist.id}>
                <Artist.ArtistLink className="flex gap-2 items-center hover:bg-spotify/10 rounded-md p-1">
                  <Artist.ArtistImage index={0} className="size-12 rounded" />
                  <Artist.Name className="truncate" />
                </Artist.ArtistLink>
              </Artist.Root>
            ))}
          </ExpandableList>
        </section>
      </section>
    </div>
  );
}
