import { ExpandedArtist } from "../util/types/spotify";
import Image from "../components/Image";
import cx from "classnames";
import ExpandableList, { ListItem } from "./ExpandableList";
import React, { useState } from "react";

const Artist = ({
  data,
  onMouseEnter,
  onClick,
  handleClose,
  isActive = false,
}: {
  data: Partial<ExpandedArtist>;
  onMouseEnter?: () => void;
  onClick: () => void;
  handleClose: () => void;
  isActive?: boolean;
}) => {
  const { artist, related_artists, collection, top_tracks } = data;

  const handleClick = isActive ? handleClose : onClick;
  return (
    <div className="w-full bg-gray-200 dark:bg-green-custom justify-self-start relative items-start flex flex-row shadow-md rounded-md dark:bg-opacity-10 group overflow-hidden">
      <div className="flex flex-col w-full min-w-full">
        <div
          className={cx({
            "border-b border-green-custom": isActive,
          })}
        >
          <div
            className="p-5 flex flex-row items-center gap-4 cursor-pointer bg-gray-200 dark:bg-green-custom dark:bg-opacity-10 dark:hover:bg-opacity-75 transition-all"
            onMouseEnter={onMouseEnter || null}
            onClick={handleClick}
          >
            <div
              className={cx(
                "overflow-hidden rounded-full shadow-md flex-shrink-0 transition-all",
                {
                  "md:w-32 md:h-32 w-20 h-20": isActive,
                  "md:w-28 md:h-28 w-20 h-20": !isActive,
                }
              )}
            >
              <Image
                src={artist.images[0]?.url}
                height={artist.images[0]?.height}
                width={artist.images[0]?.width}
                alt={artist.name}
              />
            </div>
            <div>
              <h3
                className={cx("truncate text-md font-medium transition-all", {
                  "sm:text-xl font-bold": isActive,
                  "group-hover:underline": !isActive,
                })}
              >
                {artist.name}
              </h3>
              <div className="text-sm subtext">{artist.genres.string}</div>
            </div>
          </div>
        </div>
        {isActive && (
          <div className="grid  grid-cols-1 md:grid-cols-6">
            <div className="flex flex-col gap-4 p-5 col-span-4">
              <ExpandableList title="Top Tracks">
                {top_tracks.map(({ album, ...track }) => (
                  <ListItem
                    key={track.id}
                    description={track.name}
                    image={{
                      url: album.images[0]?.url,
                      height: album.images[0]?.height,
                      width: album.images[0]?.width,
                      alt: album.name,
                      size: "xs",
                    }}
                    isRow={true}
                  />
                ))}
              </ExpandableList>
              <ExpandableList title="Albums" config={{ type: "grid" }}>
                {collection.album?.map(({ images, ...album }) => (
                  <ListItem
                    key={album.id}
                    description={album.name}
                    image={{
                      url: images[1]?.url,
                      height: images[1]?.height,
                      width: images[1]?.width,
                      alt: album.name,
                    }}
                  />
                ))}
              </ExpandableList>
              <ExpandableList title="Singles" config={{ type: "grid" }}>
                {collection.single?.map(({ images, ...album }) => (
                  <ListItem
                    key={album.id}
                    description={album.name}
                    image={{
                      url: images[1]?.url,
                      height: images[1]?.height,
                      width: images[1]?.width,
                      alt: album.name,
                    }}
                  />
                ))}
              </ExpandableList>
              <ExpandableList title="Compilations" config={{ type: "grid" }}>
                {collection.compilation?.map(({ images, ...album }) => (
                  <ListItem
                    key={album.id}
                    description={album.name}
                    image={{
                      url: images[1]?.url,
                      height: images[1]?.height,
                      width: images[1]?.width,
                      alt: album.name,
                    }}
                  />
                ))}
              </ExpandableList>
            </div>
            <div className="px-5 pb-5 md:p-5 md:border-l border-green-custom col-span-2">
              <ExpandableList title="Related Artists" startingLength={10}>
                {related_artists.map(({ images, ...artist }) => (
                  <ListItem
                    key={artist.id}
                    description={artist.name}
                    image={{
                      url: images[1]?.url,
                      height: images[1]?.height,
                      width: images[1]?.width,
                      alt: artist.name,
                      size: "xs",
                      isRounded: true,
                    }}
                    // onClick={() => {}}
                    isRow={true}
                  />
                ))}
              </ExpandableList>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Artist;
