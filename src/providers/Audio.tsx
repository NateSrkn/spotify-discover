import { useState, useEffect, useRef, createContext } from "react";
import { SimpleTrack, Track } from "../util/types/spotify";
export const AudioContext = createContext<{
  isPlaying: boolean;
  currentlyPlaying: Track | null;
  updateAudio: (track: Track | SimpleTrack) => void;
}>({
  isPlaying: false,
  currentlyPlaying: null,
  updateAudio: () => {},
});

export const AudioTracker = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      audioRef.current.pause();
    };
  }, []);

  const handleSetAudio = (track) => {
    const isActiveTrack = audioRef.current.src === track.preview_url;
    if (isActiveTrack && isPlaying) {
      setToPause();
    } else if (!isActiveTrack) {
      setCurrentlyPlaying(track);
      audioRef.current.src = track.preview_url;
      setToPlay();
    } else if (isActiveTrack && !isPlaying) {
      setToPlay();
    } else {
      setToPause();
    }
  };

  const setToPlay = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const setToPause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  return (
    <AudioContext.Provider
      value={{ isPlaying, currentlyPlaying, updateAudio: handleSetAudio }}
    >
      {children}
    </AudioContext.Provider>
  );
};
