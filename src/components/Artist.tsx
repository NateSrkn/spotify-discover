import { ExpandedArtist, SimplifiedTopItem } from "../util/types/spotify";
import Image from "next/image";
import cx from "classnames";
import ExpandableList from "./ExpandableList";

export default function Artist({
  artist,
  onClick,
  handleClose,
  isActive = false,
  expandedArtist,
}: {
  artist: SimplifiedTopItem;
  onClick?: () => void;
  handleClose?: () => void;
  isActive?: boolean;
  expandedArtist?: ExpandedArtist;
}) {
  const hasImage = artist.images.length > 0;
  return (
    <div
      className={cx(
        "w-full bg-gray-200 dark:bg-green-custom  justify-self-start relative flex flex-col shadow-md rounded-sm dark:bg-opacity-10 hover:bg-opacity-75 transition-all p-4 group",
        {
          "cursor-pointer": !isActive,
        }
      )}
      onClick={onClick}
    >
      <div className="flex flex-row gap-4 items-center">
        <div className="overflow-hidden md:w-36 md:h-36 w-20 h-20 rounded-full shadow-md flex-shrink-0">
          {hasImage ? (
            <Image
              src={artist.images[0].url}
              height={artist.images[0].height}
              width={artist.images[0].width}
              alt={`Image of ${artist.name}`}
              objectFit="cover"
            />
          ) : (
            <div className="bg-gray-200 h-full w-full"></div>
          )}
        </div>
        <div>
          <h3
            className={cx("truncate text-md font-medium transition-all", {
              "text-xl font-bold": isActive,
              "group-hover:underline": !isActive,
            })}
          >
            {artist.name}
          </h3>
          <div className="text-sm subtext">{artist.genres.string}</div>
        </div>
      </div>
      {isActive && (
        <div className="grid grid-cols-1 sm:grid-cols-2 my-4 gap-4">
          <ExpandableList
            title="Top Tracks"
            list={expandedArtist.top_tracks.map((track) => ({
              key: track.id,
              text: track.name,
              image: track.album.images[2].url,
            }))}
          />
          <ExpandableList
            title="Albums"
            list={expandedArtist.albums.map((album) => ({
              key: album.id,
              text: album.name,
              image: album.images.length && album.images[2].url,
            }))}
          />
        </div>
      )}
    </div>
  );
}
