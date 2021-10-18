import React, { useState, useEffect } from "react";
import { useTimeout, prefetchArtist, useArtist, useAlbum } from "../hooks";
import { Album, ExpandedArtist, SimpleArtist, SimpleTrack } from "../util/types/spotify";
import { useQueryClient } from "react-query";
import { ArtistList, Breadcrumb, MiniTrack } from ".";
import cx from "classnames";
import { Image, Button } from ".";
import { toUppercase } from "../util/helpers";
import { simplifyStructure } from "../util/spotify";
import { FiChevronLeft, FiX } from "react-icons/fi";
import { TrackList, AlbumList } from ".";
interface ExpandableCardProps {
  baseData: SimpleArtist;
  isOpen: boolean;
  onClick: (id: string) => void;
}
export const ExpandableCard = ({ baseData, isOpen, onClick }: ExpandableCardProps) => {
  const queryClient = useQueryClient();
  const [handleSetTimeout, handleClearTimeout] = useTimeout();
  const [activeArtist, setActiveArtist] = useState<SimpleArtist | ExpandedArtist>(baseData);
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<typeof activeArtist[]>([activeArtist]);
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

  const handleSetActiveArtist = (artist) => {
    setActiveArtist(artist);
    setActiveAlbum(null);
  };

  const handleMouseEnter = (id) => handleSetTimeout(() => prefetchArtist(queryClient, id), 500);

  const handleClick = () => (isOpen ? onClick(null) : onClick(id));
  const shouldDisplay = isOpen && isFetched && !activeAlbum;
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
              onClick={() => handleSetActiveArtist(item)}
            />
          ))}
      </div>
      <div className="bg-gray-200 dark:bg-faded-green rounded-md">
        <div
          className={cx("p-5 flex items-center", {
            "border-b border-green-custom": isOpen,
          })}
          onClick={handleClick}
          onMouseEnter={() => handleMouseEnter(id)}
          onMouseLeave={handleClearTimeout}
        >
          <div
            className={cx("img-wrapper artist is-rounded", {
              "is-expanded": isOpen,
            })}
          >
            <Image
              src={images[0].url}
              width={images[0].width}
              height={images[0].height}
              alt={name}
            />
          </div>
          <div className="pl-4 font-normal truncate">
            <h3 className="title">{name}</h3>
            <p className="subtext text-sm truncate">{genres.join(", ")}</p>
          </div>
        </div>
        <div
          className={cx("transition-all opacity-0 duration-500", {
            "opacity-100": isOpen,
            "grid grid-cols-6": shouldDisplay,
          })}
        >
          {isOpen && !isFetched && <div className="p-5">Loading...</div>}
          {shouldDisplay && (
            <React.Fragment>
              <div className="col-span-6 md:col-span-4 p-5 md:border-r md:border-green-custom">
                <TrackList tracks={artist.tracks} title="Top Tracks" />
                <AlbumList
                  albums={artist.collection?.album?.list}
                  title="Albums"
                  onClick={setActiveAlbum}
                />
                <AlbumList
                  albums={artist.collection?.single?.list}
                  title="Singles"
                  onClick={setActiveAlbum}
                />
                <AlbumList
                  albums={artist.collection?.compilation?.list}
                  title="Compilations"
                  onClick={setActiveAlbum}
                />
              </div>
              <div className="col-span-6 md:col-span-2 p-5">
                <ArtistList
                  artists={artist.related_artists.filter(
                    (a) => !breadcrumbs.some((b) => b.id === a.id)
                  )}
                  title="Related Artists"
                  onClick={handleAddBreadcrumb}
                />
              </div>
            </React.Fragment>
          )}
          {isOpen && activeAlbum && (
            <div className="p-5">
              <Button onClick={() => setActiveAlbum(null)} icon={FiChevronLeft}>
                Back
              </Button>
              <ExpandedAlbumDisplay album={album} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ExpandedAlbumDisplay = ({ album }: { album: Album }) => {
  return (
    <div className="col-span-full">
      <div className="py-4 flex gap-2 items-center flex-wrap md:flex-nowrap w-full">
        <div className="img-wrapper  mx-auto md:w-[120px] md:h-[120px]">
          <Image
            src={album.images[1].url}
            height={album.images[1].height}
            width={album.images[1].width}
            alt={album.name}
          />
        </div>
        <div className="flex flex-col w-full truncate">
          <h4 className="truncate">{album.name}</h4>
          <div className="subtext text-sm truncate">
            {toUppercase(album.album_type)} &#8226; {album.tracks.items.length} Songs &#8226;
            Released {formatDate(album.release_date)} &#8226;{" "}
            {album.artists.map((artist) => artist.name).join(", ")}
          </div>
        </div>
      </div>
      <div className={`grid grid-cols-1 md:grid-cols-2 truncate`}>
        {album.tracks.items.map((track) => (
          <div
            key={track.id}
            className={cx("flex w-full truncate", {
              "col-span-full": album.total_tracks < 2,
            })}
          >
            <MiniTrack
              isNumbered={true}
              hasImage={false}
              track={simplifyStructure({ ...track, album }) as SimpleTrack}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const formatDate = (input) => {
  const date = new Date(input);
  if (!isNaN(date.getTime())) {
    return date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();
  }
};
