"use client";

import {
  createContext,
  FC,
  Fragment,
  HTMLAttributes,
  PropsWithChildren,
  use,
} from "react";
import cx from "classnames";
import Link from "next/link";
import { AudioLines, ListMinus, ListPlus, Pause, Play } from "lucide-react";
import * as Artist from "@/components/Artist";
import { PreviewAudio } from "@/providers/PreviewProvider";
import { usePlaylistStore } from "@/store/playlist";
import TrackObjectFull = SpotifyApi.TrackObjectFull;
import TrackObjectSimplified = SpotifyApi.TrackObjectSimplified;

type FullTrackContext = {
  track: TrackObjectFull;
  type: "full";
};

type SimplifiedTrackContext = {
  track: TrackObjectSimplified;
  type: "simplified";
};

type TrackContextType = FullTrackContext | SimplifiedTrackContext;
const TrackContext = createContext<TrackContextType>({
  track: null,
  type: null,
});

export const Root: FC<
  PropsWithChildren<{ track: TrackObjectFull | TrackObjectSimplified }>
> = ({ children, track }) => {
  return (
    <TrackContext.Provider
      value={
        {
          track,
          type: assertFullTrack(track) ? "full" : "simplified",
        } as TrackContextType
      }
    >
      {children}
    </TrackContext.Provider>
  );
};

export const AlbumCover: FC<HTMLAttributes<HTMLImageElement>> = (props) => {
  const { track, type } = use(TrackContext);
  const { className, ...rest } = props;
  if (type === "simplified") {
    return null;
  }
  return (
    <img
      src={track?.album.images[0]?.url}
      alt={track?.name}
      className={cx("aspect-square rounded", className)}
      {...rest}
    />
  );
};

export const TrackName: FC<
  PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>
> = ({ children, ...rest }) => {
  const { track } = use(TrackContext);
  return <h3 {...rest}>{track?.name || children}</h3>;
};

export const TrackArtists: FC<HTMLAttributes<HTMLParagraphElement>> = (
  props,
) => {
  const { track } = use(TrackContext);
  return (
    <p {...props}>
      {track?.artists.map((artist, index) => {
        return (
          <Fragment key={artist.id}>
            <Link
              href={`/${artist.type}/${artist.id}`}
              key={artist.id}
              className="hover:underline"
            >
              {artist.name}
            </Link>
            {index < track.artists.length - 1 ? ", " : ""}
          </Fragment>
        );
      })}
    </p>
  );
};

export const LinkToArtist: FC<HTMLAttributes<HTMLAnchorElement>> = (props) => {
  const { track } = use(TrackContext);
  const [artist] = track?.artists || [];
  return (
    <Artist.Root artist={artist}>
      <Artist.ArtistLink {...props} />
    </Artist.Root>
  );
};

export const LinkToSpotify: FC<HTMLAttributes<HTMLAnchorElement>> = (props) => {
  const { track } = use(TrackContext);
  const { children, ...rest } = props;
  return (
    <a {...rest} href={track.external_urls.spotify} target={"_blank"}>
      {children}
    </a>
  );
};

export const TrackNumber = () => {
  const { track } = use(TrackContext);
  return (
    <div className="text-xs font-mono tabular-nums min-w-[16px] inline-block text-right">
      <span>{track.track_number}</span>
    </div>
  );
};

export const PreviewButton: FC<HTMLAttributes<HTMLButtonElement>> = (props) => {
  const { track } = use(TrackContext);
  if (!track.preview_url) {
    return null;
  }
  const { set, playing, track: current } = use(PreviewAudio);
  const { className, ...rest } = props;
  const isPlaying = playing && track.preview_url === current.preview_url;
  return (
    <button
      className={cx(
        "cursor-pointer p-2 hover:bg-spotify/10 hover:text-spotify rounded-full transition-colors",
        className,
        {
          "bg-spotify/10 text-spotify": isPlaying,
        },
      )}
      {...rest}
      onClick={(event) => {
        event.stopPropagation();
        set(track);
      }}
    >
      <AudioLines />
    </button>
  );
};

export const PausePlayButton: FC<HTMLAttributes<HTMLButtonElement>> = (
  props,
) => {
  const { track } = use(TrackContext);
  const { set, playing, track: current } = use(PreviewAudio);
  const { className, ...rest } = props;
  const isPlaying = playing && track.preview_url === current.preview_url;
  return (
    <button
      className={cx(
        "cursor-pointer p-2 hover:bg-spotify/10 hover:text-spotify rounded-full transition-colors ",
        className,
      )}
      {...rest}
      onClick={() => set(track)}
    >
      {isPlaying ? (
        <Pause className="fill-white" />
      ) : (
        <Play className="fill-white" />
      )}
    </button>
  );
};

export const AddToPlaylistButton: FC<HTMLAttributes<HTMLButtonElement>> = (
  props,
) => {
  const { track } = use(TrackContext);
  const { className, ...rest } = props;
  const included = usePlaylistStore((state) => state.tracks[track.id]);
  const actions = usePlaylistStore((state) => state.actions);
  return (
    <button
      className={cx(
        "group cursor-pointer p-2 hover:bg-spotify/10 hover:text-spotify rounded-full",
        className,
        {
          "bg-spotify/10 text-spotify": included,
        },
      )}
      {...rest}
      onClick={() => {
        if (included) {
          actions.remove(track.id);
        } else {
          actions.add(track);
        }
      }}
    >
      {included ? <ListMinus /> : <ListPlus />}
    </button>
  );
};

const assertFullTrack = (
  track: TrackObjectFull | TrackObjectSimplified,
): track is SpotifyApi.TrackObjectFull => {
  return "album" in track;
};
