import React, { useState, useEffect } from "react";
import { useTimeout, prefetchArtist, useArtist, useAlbum } from "../hooks";
import {
  Album,
  ExpandedArtist,
  SimpleArtist,
  SimpleTrack,
} from "../util/types/spotify";
import { useQueryClient } from "react-query";
import { Breadcrumb, MiniTrack } from ".";
import cx from "classnames";
import { Image, Button, ExpandableList, ListItem } from ".";
import { toUppercase } from "../util/helpers";
import { simplifyStructure } from "../util/spotify";
import { FiX } from "react-icons/fi";
interface ExpandableCardProps {
  baseData: SimpleArtist;
  isOpen: boolean;
  onClick: (id: string) => void;
}
export const ExpandableCard = ({
  baseData,
  isOpen,
  onClick,
}: ExpandableCardProps) => {
  const [activeArtist, setActiveArtist] = useState<
    SimpleArtist | ExpandedArtist
  >(baseData);
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<typeof activeArtist[]>([
    activeArtist,
  ]);
  const { data: artist, isFetched } = useArtist({
    artist: activeArtist,
    isEnabled: isOpen,
  });
  const { data: album } = useAlbum({
    album: activeAlbum,
    isEnabled: !!activeAlbum?.id,
  });
  const { name, id, genres, images } = artist;

  useEffect(() => !isOpen && setActiveArtist(baseData), [isOpen, baseData]);
  const isBreadcrumb = (item) => item.id !== baseData.id;

  const handleAddBreadcrumb = (item) => {
    if (breadcrumbs.some((b) => b.id === item.id)) return;
    setActiveArtist(item);
    setBreadcrumbs((prev) => [...prev, item]);
  };

  const handleRemoveBreadcrumb = (item) => {
    const index = breadcrumbs.findIndex((i) => i.id === item.id);
    const replacement = breadcrumbs[index - 1];
    setActiveArtist(replacement);
    setBreadcrumbs(breadcrumbs.filter((i) => i.id !== item.id));
  };

  return (
    <div
      className="transition-all"
      aria-selected={isOpen}
      aria-current={isOpen}
      aria-expanded={isOpen}
    >
      <div
        className={cx("transition-all duration-500", {
          "opacity-0": !isOpen,
          "opacity-100 visible flex gap-2 flex-wrap mb-4": isOpen,
        })}
      >
        {isOpen &&
          breadcrumbs.map((item) => (
            <Breadcrumb
              key={item.id}
              crumb={item}
              isActive={item.id === activeArtist.id}
              onClick={() => setActiveArtist(item)}
            />
          ))}
      </div>

      <div className="w-full bg-gray-200 dark:bg-faded-green justify-self-start relative items-start flex flex-row shadow-md rounded-md group overflow-hidden">
        <div className="flex flex-col flex-wrap w-full min-w-full">
          <div className={isOpen && `border-b border-green-custom`}>
            <div
              className="p-5 flex flex-row md:flex-row cursor-pointer bg-gray-200 dark:bg-faded-green transition-all items-center gap-4 w-full"
              onClick={() => (isOpen ? onClick(null) : onClick(id))}
            >
              <div
                className={cx(
                  "overflow-hidden shadow-md flex-shrink-0 rounded-full w-16 h-16 transition-all",
                  {
                    "md:w-32 md:h-32": isOpen,
                    "md:w-28 md:h-28": !isOpen,
                  }
                )}
              >
                <Image
                  src={images[0]?.url}
                  height={images[0]?.height}
                  width={images[0]?.width}
                  alt={name}
                />
              </div>
              <div className="w-full max-w-full">
                <h3
                  className={cx(
                    "truncate text-sm font-medium transition-all w-full",
                    {
                      "sm:text-xl font-bold": isOpen,
                      "group-hover:underline": !isOpen,
                    }
                  )}
                >
                  {name}
                </h3>
                <div className="text-xs subtext md:text-sm overflow-ellipsis">
                  {genres?.join(", ")}
                </div>
              </div>
              {!isOpen && breadcrumbs.length > 1 && (
                <div className="bg-gray-100 dark:bg-green-custom px-2 py-1 rounded-md self-start ml-auto text-sm">
                  {breadcrumbs.length}
                </div>
              )}
              {isOpen && isBreadcrumb(artist) && (
                <div className="absolute top-4 right-4">
                  <Button
                    onClick={() => handleRemoveBreadcrumb(artist)}
                    title={`Remove ${artist.name}`}
                    className="rounded-full background-hover w-max hover:scale-105 p-1"
                  >
                    <FiX />
                  </Button>
                </div>
              )}
            </div>
          </div>
          {isOpen && isFetched && activeAlbum && (
            <div className="pt-5 px-5 pb-2">
              <Button onClick={() => setActiveAlbum(null)}>
                Back to {name}
              </Button>
            </div>
          )}
          <div
            className={cx("transition-all duration-700", {
              "p-5 opacity-100 visible": isOpen,
              "grid grid-cols-1 md:grid-cols-6 p-0": isFetched,
              "opacity-0 invisible p-0": !isOpen,
            })}
          >
            {isOpen && !isFetched && "Loading..."}
            {isOpen && isFetched && !activeAlbum && (
              <ExpandedArtistDisplay
                artist={artist as ExpandedArtist}
                breadcrumbs={breadcrumbs}
                handleAddBreadcrumb={handleAddBreadcrumb}
                setActiveAlbum={setActiveAlbum}
              />
            )}
            {isOpen && isFetched && activeAlbum && (
              <ExpandedAlbumDisplay album={album} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExpandedArtistDisplay = ({
  artist,
  breadcrumbs,
  handleAddBreadcrumb,
  setActiveAlbum,
}: {
  artist: ExpandedArtist;
  breadcrumbs: Array<SimpleArtist | ExpandedArtist | Album>;
  handleAddBreadcrumb: (item: SimpleArtist | ExpandedArtist | Album) => void;
  setActiveAlbum: (album: Album) => void;
}) => {
  const queryClient = useQueryClient();
  const [handleSetTimeout, handleClearTimeout] = useTimeout();
  return (
    <React.Fragment>
      <div className="flex flex-col gap-4 md:col-span-4 p-5">
        <ExpandableList title="Top Tracks">
          {artist?.tracks?.map((track) => (
            <MiniTrack key={track.id} track={track} />
          ))}
        </ExpandableList>
        {Object.entries(artist.collection).map(([key, values]) => (
          <ExpandableList
            key={key}
            title={`${toUppercase(key)}s`}
            config={{ type: "grid" }}
          >
            {values?.list?.map(({ images, ...album }) => (
              <ListItem
                key={album.id}
                description={album.name}
                image={{
                  url: images[1]?.url,
                  height: images[1]?.height,
                  width: images[1]?.width,
                  alt: album.name,
                }}
                onClick={() => setActiveAlbum({ images, ...album })}
              />
            ))}
          </ExpandableList>
        ))}
      </div>
      <div className="px-5 pb-5 md:p-5 md:border-l border-green-custom col-span-2">
        <ExpandableList title="Related Artists" startingLength={10}>
          {artist.related_artists
            .filter(
              (artist) => !breadcrumbs.some((crumb) => crumb.id === artist.id)
            )
            .map(({ images, ...artist }) => (
              <ListItem
                key={artist.id}
                description={artist.name}
                image={{
                  url: images[2]?.url,
                  height: images[2]?.height,
                  width: images[2]?.width,
                  alt: artist.name,
                  size: "xs",
                  isRounded: true,
                }}
                onMouseEnter={() =>
                  handleSetTimeout(() => prefetchArtist(queryClient, artist.id))
                }
                onMouseLeave={handleClearTimeout}
                onClick={() => handleAddBreadcrumb({ ...artist, images })}
                isRow={true}
              />
            ))}
        </ExpandableList>
      </div>
    </React.Fragment>
  );
};

const ExpandedAlbumDisplay = ({ album }: { album: Album }) => {
  return (
    <div className="col-span-full px-5">
      <h4 className="mb-2">{album.name}</h4>
      {album.tracks.items.map((track) => (
        <MiniTrack
          key={track.id}
          track={simplifyStructure({ ...track, album }) as SimpleTrack}
        />
      ))}
    </div>
  );
};
