import React, { useContext } from "react";
import { SimpleTrack } from "../util/types/spotify";
import { Image } from ".";
import { AudioContext } from "../providers";
import cx from "classnames";
import { FiPlay, FiPause } from "react-icons/fi";

export const Track = ({ track }: { track: SimpleTrack }) => {
  const { updateAudio, currentlyPlaying, isPlaying } = useContext(AudioContext);
  const isCurrentTrack = currentlyPlaying?.id === track.id;
  return (
    <div
      className={cx(
        "w-full bg-green-custom  justify-self-start relative flex flex-col shadow-md rounded-md bg-opacity-10 p-5 track",
        {
          "text-spotify-green": isCurrentTrack,
        }
      )}
      onClick={() => updateAudio(track)}
    >
      <div className="flex flex-row items-center gap-4">
        <div className="md:w-28 md:h-28 w-16 h-16 shadow-md flex-shrink-0">
          <Image
            src={track.images[0]?.url}
            height={track.images[0]?.height}
            width={track.images[0]?.width}
            alt={track.name}
          />
        </div>
        <div className="truncate">
          <h3 className="truncate text-md font-medium">{track.name}</h3>
          <div className="truncate text-sm subtext">
            {track.artists.map((a) => a.name).join(", ")}
          </div>
        </div>
        <IconHandler isCurrentTrack={isCurrentTrack} isPlaying={isPlaying} />
      </div>
    </div>
  );
};

export const MiniTrack = ({ track }: { track: SimpleTrack }) => {
  const { updateAudio, currentlyPlaying, isPlaying } = useContext(AudioContext);
  const isCurrentTrack = currentlyPlaying?.id === track.id;
  return (
    <div
      className={cx(
        "w-full my-1 hover:bg-gray-100 dark:hover:bg-green-custom p-1 cursor-pointer rounded-md transition-all mini-track",
        {
          "text-spotify-green": isCurrentTrack,
        }
      )}
      title={track.name}
      onClick={() => updateAudio(track)}
    >
      <div className="flex items-center">
        <div className="flex items-center gap-4">
          <div className="img-wrapper xs">
            <Image
              src={track.images[0].url}
              height={track.images[0].height}
              width={track.images[0].width}
              alt={track.name}
            />
          </div>
          <div className="card-sm-text">{track.name}</div>
        </div>
        <IconHandler isCurrentTrack={isCurrentTrack} isPlaying={isPlaying} />
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
