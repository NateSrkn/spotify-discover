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
    <button
      className={cx(
        "w-full bg-green-custom  justify-self-start relative flex flex-col shadow-md rounded-md bg-opacity-10 p-5 track",
        {
          "text-spotify-green": isCurrentTrack,
          "cursor-pointer": isPlayable,
        }
      )}
      onClick={isPlayable ? () => updateAudio(track) : null}
      tabIndex={isPlayable ? 0 : -1}
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
    </button>
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
    <button
      className={cx(
        "w-full hover:bg-slate-200 dark:hover:bg-primary-green p-1 cursor-pointer rounded-sm transition-all mini-track flex truncate justify-center items-center",
        {
          "text-spotify-green": isCurrentTrack,
          "md:p-2 px-1 py-2": !hasImage,
        }
      )}
      title={track.name}
      onClick={isPlayable ? () => updateAudio(track) : null}
      tabIndex={isPlayable ? 0 : -1}
    >
      <div className="flex items-center gap-2 w-full">
        {isNumbered && <div className="text-xs subtext">{track.track_number}.</div>}
        <div className="flex items-center gap-4 w-full truncate">
          {hasImage && (
            <div className="img-wrapper breadcrumb">
              <Image
                src={track.album.images[0]?.url}
                height={track.album.images[0]?.height}
                width={track.album.images[0]?.width}
                alt={track.name}
                className="rounded shadow"
              />
            </div>
          )}
          <div className="card-sm-text truncate">{track.name}</div>
        </div>

        {!isPlayable && <div className="badge min-w-max p-1 rounded-md">No Preview Available</div>}
        {isPlayable && <IconHandler isCurrentTrack={isCurrentTrack} isPlaying={isPlaying} />}
      </div>
    </button>
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
