"use client";
import { useWindowSize } from "@/hooks/useWindowSize";
import { usePlaylistStore } from "@/store/playlist";
import { useShallow } from "zustand/react/shallow";
import { use, useMemo } from "react";
import { PreviewAudio } from "@/providers/PreviewProvider";
import { Drawer } from "vaul";
import { ListMusic, Play, X } from "lucide-react";
import cx from "classnames";
import * as Track from "@/components/Track";
import { Button } from "@/components/Button";

export const Playlist = () => {
  const { width } = useWindowSize();
  const playlist = usePlaylistStore(
    useShallow((state) => ({
      name: state.name,
      tracks: state.tracks,
    })),
  );
  const { queue } = use(PreviewAudio);
  const tracks = useMemo(
    () => Object.values(playlist.tracks),
    [playlist.tracks],
  );
  const count = tracks.length;
  const desktop = useMemo(() => width > 640, [width]);
  return (
    <Drawer.Root direction={desktop ? "left" : "bottom"}>
      <Drawer.Trigger asChild>
        <button className="bg-spotify/10 text-spotify/50 hover:text-spotify rounded-full py-2 px-4 flex items-center gap-2 cursor-pointer">
          <ListMusic
            className={cx({
              "text-spotify": count > 0,
            })}
          />
          {count > 0 && (
            <span className="text-white flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content
          className={cx(
            "bg-primary-green flex flex-col  fixed bottom-0 left-0 right-0 outline-none p-4  gap-4",
            {
              "w-full h-fit max-h-[500px] rounded-t-3xl": !desktop,
              "w-[500px] h-screen": desktop,
            },
          )}
        >
          <Drawer.Close className="absolute top-4 right-4 cursor-pointer hover:bg-spotify/10 p-2 rounded-full transition-colors">
            <X />
          </Drawer.Close>
          <div className="flex justify-between">
            <div>
              <Drawer.Title className="text-3xl font-bold">
                {playlist.name}
              </Drawer.Title>
              <Drawer.Description>{tracks.length} tracks</Drawer.Description>
            </div>
          </div>
          <Button onClick={() => queue(tracks)} className="gap-2">
            <Play className="fill-spotify" />
            <p>Preview Playlist</p>
          </Button>
          <ul className="flex flex-col gap-2 overflow-y-auto pb-20">
            {tracks.map((track) => (
              <Track.Root track={track} key={track.id}>
                <li className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Track.AlbumCover className="size-12" />
                    <Track.TrackName className="line-clamp-1" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Track.PreviewButton />
                    {/*<Track.AddToPlaylistButton />*/}
                  </div>
                </li>
              </Track.Root>
            ))}
          </ul>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
