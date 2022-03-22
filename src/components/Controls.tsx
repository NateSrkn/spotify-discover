import * as React from "react";
import { Button } from ".";
import { AudioContext } from "../providers";
import { FiPause, FiPlay, FiVolumeX, FiVolume1, FiVolume2 } from "react-icons/fi";
import * as Slider from "@radix-ui/react-slider";
export default function Controls() {
  const {
    currentlyPlaying,
    isPlaying,
    updateAudio,
    handleSetVolume,
    currentVolume,
    handleSetMute,
    isMuted,
  } = React.useContext(AudioContext);

  const PlayIconHandler = ({ isPlaying }) => {
    return (
      <React.Fragment>
        {isPlaying && <FiPause className="text-black dark:text-white fill-current" />}
        {!isPlaying && <FiPlay className="text-black dark:text-white fill-current" />}
      </React.Fragment>
    );
  };

  const handleToggle = () => updateAudio(currentlyPlaying);

  const VolumeIconHandler = () => {
    const VolumeIcon = () => {
      if (currentVolume < 0.5) {
        return (
          <FiVolume1
            className="text-black dark:text-white fill-current cursor-pointer"
            onClick={handleSetMute}
          />
        );
      } else if (currentVolume >= 0.5) {
        return (
          <FiVolume2
            className="text-black dark:text-white fill-current cursor-pointer"
            onClick={handleSetMute}
          />
        );
      }
    };
    return (
      <React.Fragment>
        {isMuted && (
          <FiVolumeX
            className="text-black dark:text-white fill-current cursor-pointer"
            onClick={() => {
              handleSetVolume(currentVolume);
              handleSetMute();
            }}
          />
        )}
        {!isMuted && <VolumeIcon />}
      </React.Fragment>
    );
  };
  if (!currentlyPlaying) return null;
  return (
    <div className="flex items-center bg-gray-200 dark:bg-[#242D2D] p-3 w-full md:max-w-sm rounded shadow-2xl gap-2">
      <div className="flex items-center gap-4 max-w-[300px] truncate w-full group ">
        <Button action={handleToggle}>
          <PlayIconHandler isPlaying={isPlaying} />
        </Button>
        <div className="truncate">
          <div className="text-xs truncate">{currentlyPlaying.name}</div>
          <div className="text-xs text-gray-500 truncate">
            {currentlyPlaying.artists.map((artist) => artist.name).join(", ")}
          </div>
        </div>
      </div>
      <div className="flex gap-1">
        <VolumeIconHandler />
        <Slider.Root
          defaultValue={[currentVolume]}
          max={1}
          step={0.01}
          value={[isMuted ? 0 : currentVolume]}
          aria-label="Volume"
          onValueChange={(value) => {
            if (isMuted) {
              handleSetMute();
            }
            handleSetVolume(value[0]);
          }}
          className="relative flex items-center w-24 group cursor-pointer"
        >
          <Slider.Track className="bg-blue-200 relative flex-grow rounded-full h-1">
            <Slider.Range className="absolute bg-blue-300 group-hover:bg-spotify-green rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="h-2 w-2 group-hover:block bg-white rounded-full cursor-pointer hidden" />
        </Slider.Root>
      </div>
    </div>
  );
}
