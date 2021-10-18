import React from "react";
import { useQueryClient } from "react-query";
import { ExpandableList, Image } from ".";
import { prefetchArtist, useTimeout } from "../hooks";
import { Artist, SimpleArtist } from "../util/types/spotify";

export const ArtistList = ({
  artists,
  title = "",
  onClick,
}: {
  artists: SimpleArtist[] | Artist[];
  title?: string;
  onClick: (artist: SimpleArtist | Artist) => void;
}) => {
  const [handleSetTimeout, handleClearTimeout] = useTimeout();
  const queryClient = useQueryClient();
  const handleMouseEnter = (artist) =>
    handleSetTimeout(() => prefetchArtist(queryClient, artist.id), 500);

  return (
    <ExpandableList title={title} startingLength={title ? 10 : artists.length}>
      {artists.map((artist) => (
        <div
          key={artist.id}
          className="flex items-center truncate p-1 hover:bg-gray-100 dark:hover:bg-green-custom rounded-sm cursor-pointer"
          title={artist.name}
          onClick={() => onClick(artist)}
          onMouseEnter={() => handleMouseEnter(artist)}
          onMouseLeave={handleClearTimeout}
        >
          <div className="img-wrapper breadcrumb is-rounded">
            <Image
              src={artist.images[2]?.url}
              height={artist.images[2]?.height}
              width={artist.images[2]?.width}
              alt={artist.name}
            />
          </div>
          <div className="text-sm truncate pl-3">{artist.name}</div>
        </div>
      ))}
    </ExpandableList>
  );
};
