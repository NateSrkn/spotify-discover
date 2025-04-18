import { ARTIST_URL, withAuthHeader } from "@/hooks/spotify/queries";
import ky from "ky";
import { auth } from "@/auth";
import TrackObjectFull = SpotifyApi.TrackObjectFull;
import * as Track from "@/components/Track";
import { cache } from "react";
const getTopTracks = cache(async (id: string) => {
  const session = await auth();
  const data = await ky<{
    tracks: TrackObjectFull[];
  }>(
    `${ARTIST_URL(id)}/top-tracks`,
    withAuthHeader(session.access_token),
  ).json();
  return data.tracks.sort((a, b) => b.popularity - a.popularity);
});

export default async function RootArtistsPage({ params }) {
  const { artist_id } = await params;
  const tracks = await getTopTracks(artist_id);

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {tracks.map((track) => (
        <Track.Root track={track} key={track.id}>
          <Track.LinkToSpotify className="hover:text-spotify">
            <li className="flex gap-2 items-center">
              <Track.AlbumCover className="size-12" />
              <div className="w-full truncate text-sm">
                <Track.TrackName className="truncate font-medium" />
                <Track.TrackArtists className="truncate text-pewter-blue" />
              </div>
              <div className="text-sm gap-2 flex">
                <Track.PreviewButton className="text-white" />
                {/*<Track.AddToPlaylistButton />*/}
              </div>
            </li>
          </Track.LinkToSpotify>
        </Track.Root>
      ))}
    </ul>
  );
}
