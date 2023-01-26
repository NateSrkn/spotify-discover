import React from "react";
import { FiPlay, FiPause } from "react-icons/fi";
import { Link } from "./Link";
import { requests } from "../util/helpers";
import { Image } from "./Image";
export const Track = ({ track, hasImage = false }) => {
  if (!track) return <SkeletonTrack hasImage={hasImage} />;
  return (
    <div className="flex items-center gap-4 w-full truncate">
      {hasImage ? (
        <div className="img-wrap sm-img soft-round">
          <Image src={track.album.images[0]?.url} height={100} width={100} alt={track.name} />
        </div>
      ) : null}
      <div className="flex flex-col truncate">
        <div className="card-sm-text truncate">{track.name}</div>
        <div className="truncate subtext text-xs">
          {track.artists.map((artist, index) => (
            <span key={artist.id}>
              <Link
                href={`/artist/${artist.id}/top-tracks`}
                swrKey={requests["artist"](artist.id)}
                className="hover:underline truncate"
              >
                {artist.name}
              </Link>
              <span className="truncate">{index < track.artists.length - 1 ? ", " : ""}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const SkeletonTrack = ({ hasImage }) => {
  return (
    <div className="flex items-center gap-4 w-full">
      {hasImage ? (
        <div className="img-wrap sm-img soft-round w-full h-full">
          <Image src={undefined} height={100} width={100} alt={""} />
        </div>
      ) : null}
      <div className="flex flex-col gap-2 w-full">
        <div className="skeleton-text" />
        <div className="skeleton-text" />
      </div>
    </div>
  );
};

const IconHandler = ({ isCurrentTrack, isPlaying }) => {
  return (
    <React.Fragment>
      {isCurrentTrack && isPlaying && <FiPause className="icon" />}
      {isCurrentTrack && !isPlaying && <FiPlay className="icon" />}
      {!isCurrentTrack && <FiPlay className="icon" />}
    </React.Fragment>
  );
};
