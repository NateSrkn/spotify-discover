import React, { useContext } from "react";
import { SimpleTrack } from "../util/types/spotify";
import { Image } from ".";
import { AudioContext } from "../providers";
import cx from "classnames";
import { FiPlay, FiPause } from "react-icons/fi";

export const Track = ({ track }: { track: SimpleTrack }) => {
  const { updateAudio, currentlyPlaying, isPlaying } = useContext(AudioContext);
  const isCurrentTrack = currentlyPlaying?.id === track.id;
  const isPlayable = !!track.preview_url;
  return (
    <div
      className={cx(
        "w-full bg-green-custom  justify-self-start relative flex flex-col shadow-md rounded-md bg-opacity-10 p-5 track",
        {
          "text-spotify-green": isCurrentTrack,
        }
      )}
      onClick={isPlayable ? () => updateAudio(track) : null}
    >
      <div className="flex flex-row items-center gap-4">
        <div className="img-wrapper artist">
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
        {!isPlayable && (
          <div className="badge p-1 rounded-md absolute top-2 right-2">No Preview Available</div>
        )}
        {isPlayable && <IconHandler isCurrentTrack={isCurrentTrack} isPlaying={isPlaying} />}
      </div>
    </div>
  );
};

export const MiniTrack = ({
  track,
  isNumbered = false,
  hasImage = true,
}: {
  track: SimpleTrack;
  isNumbered?: boolean;
  hasImage?: boolean;
}) => {
  const { updateAudio, currentlyPlaying, isPlaying } = useContext(AudioContext);
  const isCurrentTrack = currentlyPlaying?.id === track.id;
  const isPlayable = !!track.preview_url;
  return (
    <div
      className={cx(
        "w-full hover:bg-gray-100 dark:hover:bg-green-custom p-1 cursor-pointer rounded-sm transition-all mini-track",
        {
          "text-spotify-green": isCurrentTrack,
          "py-2 px-1": !hasImage,
        }
      )}
      title={track.name}
      onClick={() => updateAudio(track)}
    >
      <div className="flex items-center gap-2 w-full">
        {isNumbered && <div className="text-xs subtext tabular-nums">{track.track_number}.</div>}
        <div className="flex items-center gap-4 w-full truncate">
          {hasImage && (
            <div className="img-wrapper breadcrumb">
              <Image
                src={track.images[0]?.url}
                height={track.images[0]?.height}
                width={track.images[0]?.width}
                alt={track.name}
              />
            </div>
          )}
          <div className="card-sm-text truncate">{track.name}</div>
        </div>

        {!isPlayable && <div className="badge min-w-max p-1 rounded-md">No Preview Available</div>}
        {isPlayable && <IconHandler isCurrentTrack={isCurrentTrack} isPlaying={isPlaying} />}
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
