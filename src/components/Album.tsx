"use client";
import {
  createContext,
  ElementType,
  FC,
  HTMLAttributes,
  PropsWithChildren,
  use,
} from "react";
import { DynamicComponent, DynamicComponentProps } from "@/components/Dynamic";
import cx from "classnames";
import Link from "next/link";
import dayjs from "dayjs";
import { useInfiniteQuery } from "@tanstack/react-query";
import { album_queries, artist_queries } from "@/hooks/spotify/queries";
import * as Track from "@/components/Track";

type Album = SpotifyApi.AlbumObjectFull | SpotifyApi.AlbumObjectSimplified;
type AlbumContextType =
  | {
      album: null;
      type: null;
    }
  | {
      album: SpotifyApi.AlbumObjectFull;
      type: "full";
    }
  | {
      album: SpotifyApi.AlbumObjectSimplified;
      type: "simplified";
    };

const AlbumContext = createContext<AlbumContextType>({
  album: null,
  type: null,
});

export const Root: FC<
  PropsWithChildren<{
    album: Album;
  }>
> = ({ children, album }) => {
  return (
    <AlbumContext.Provider
      value={{ album, type: assertFullAlbum(album) } as AlbumContextType}
    >
      {children}
    </AlbumContext.Provider>
  );
};

export const Title = <T extends ElementType>(
  props: DynamicComponentProps<T>,
) => {
  const { album } = use(AlbumContext);
  return <DynamicComponent {...props}>{album?.name}</DynamicComponent>;
};

export const ReleaseDate = (props: HTMLAttributes<HTMLSpanElement>) => {
  const { album } = use(AlbumContext);
  return (
    <span {...props}>{dayjs(album?.release_date).format("MMMM DD, YYYY")}</span>
  );
};

export const AlbumCover = (props: HTMLAttributes<HTMLImageElement>) => {
  const { album } = use(AlbumContext);
  const image = album?.images[0];
  const { className, ...rest } = props;
  return (
    <img
      alt={album?.name}
      {...rest}
      src={image.url}
      width={image.width}
      height={image.height}
      className={cx("aspect-square", className)}
    />
  );
};

export const AlbumLink = (props: HTMLAttributes<HTMLAnchorElement>) => {
  const { album } = use(AlbumContext);
  return (
    <Link
      href={{
        pathname: "./albums",
        query: { album_id: album.id },
      }}
      {...props}
    >
      {props.children}
    </Link>
  );
};

export const Details = ({ album }: { album: SpotifyApi.AlbumObjectFull }) => {
  const { data: tracks, status: tracks_status } = useInfiniteQuery(
    album_queries.tracks(album?.id),
  );

  if (!album || tracks_status !== "success") {
    return null;
  }

  return (
    <Root album={album}>
      <div className="flex flex-col gap-4 bg-secondary-green/40 p-4 rounded-xl">
        <div className="flex gap-2 flex-col sm:flex-row">
          <AlbumCover className={"w-full sm:size-64"} />
          <div className="text-center sm:text-left">
            <Title className="text-2xl font-bold" />
            <p className="text-sm">
              {album?.artists.map((artist) => artist.name).join(", ")}
            </p>
            <ReleaseDate className="text-sm" />
          </div>
        </div>
        {tracks.pages.map((page) => {
          let count = Math.floor(page.items.length / 2);
          if (page.items.length % 2) {
            count++;
          }
          return (
            <ul
              className={
                "grid grid-cols-1 md:grid-cols-2 md:grid-flow-col gap-2"
              }
              key={page.href}
              style={{
                gridTemplateRows: `repeat(${count}, minmax(0, 1fr))`,
              }}
            >
              {page.items.map((track) => (
                <Track.Root track={track} key={track.id}>
                  <li className="flex items-center justify-between gap-4 w-full">
                    <div className="flex gap-3 items-center truncate">
                      <Track.TrackNumber />
                      <div className="truncate w-full text-sm">
                        <Track.TrackName className="font-medium truncate" />
                        <Track.TrackArtists className="text-pewter-blue truncate" />
                      </div>
                    </div>
                    <div className="text-sm gap-2 flex">
                      <Track.PreviewButton />
                      <Track.AddToPlaylistButton />
                    </div>
                  </li>
                </Track.Root>
              ))}
            </ul>
          );
        })}
      </div>
    </Root>
  );
};

export const List = ({ artist_id }) => {
  const albums = useInfiniteQuery(artist_queries.albums(artist_id));
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
      {albums.data?.pages.map((page) =>
        page.items.map((album) => (
          <Root album={album} key={album.id}>
            <AlbumLink className="self-stretch">
              <li className="flex flex-col w-full gap-2">
                <AlbumCover className="w-full rounded" />
                <Title className="line-clamp-2" />
              </li>
            </AlbumLink>
          </Root>
        )),
      )}
    </ul>
  );
};

const assertFullAlbum = (album: Album): album is SpotifyApi.AlbumObjectFull => {
  return "tracks" in album;
};
