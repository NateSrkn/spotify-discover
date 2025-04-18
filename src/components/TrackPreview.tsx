"use client";
import { PreviewAudio } from "@/providers/PreviewProvider";
import { use } from "react";
import * as Track from "@/components/Track";
export const TrackPreview = () => {
  const { track } = use(PreviewAudio);
  if (!track) return null;
  let album_cover = "";
  if ("album" in track) {
    album_cover = track.album?.images[0]?.url;
  }
  return (
    <div className="fixed bottom-2 left-2 right-2">
      <Track.Root track={track}>
        <div
          className="bg-secondary-green w-full md:container md:mx-auto flex items-center gap-2 rounded-2xl shadow-lg overflow-hidden"
          style={{
            backgroundImage: `url(${album_cover})`,
            backgroundSize: "cover",
          }}
        >
          <div className="backdrop-blur-xl bg-black/40 w-full h-full  p-4 flex items-center">
            <div className="flex items-center gap-2 w-full">
              <Track.AlbumCover className={"size-12"} />
              <div className="text-sm truncate flex flex-col w-full">
                <Track.TrackName className={"truncate font-bold"} />
                <Track.TrackArtists className={"truncate"} />
              </div>
              <Track.PausePlayButton />
            </div>
          </div>
        </div>
      </Track.Root>
    </div>
  );
};
