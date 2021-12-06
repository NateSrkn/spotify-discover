import { useState, useEffect, useRef, createContext } from "react";
import { SimpleTrack, Track } from "../util/types/spotify";
export const AudioContext = createContext<{
  isPlaying: boolean;
  currentlyPlaying: Track | null;
  updateAudio: (track: Track | SimpleTrack) => void;
  handleSetVolume: (volume: number) => void;
  currentVolume: number;
  isMuted: boolean;
  handleSetMute: () => void;
}>({
  isPlaying: false,
  currentlyPlaying: null,
  updateAudio: () => {},
  handleSetVolume: () => {},
  currentVolume: 0,
  isMuted: false,
  handleSetMute: () => {},
});

export const AudioTracker = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.addEventListener("ended", () => {
      setIsPlaying(false);
    });
    return () => {
      audioRef.current.pause();
    };
  }, []);

  const handleSetVolume = (value: number) => {
    setVolume(value);
    audioRef.current.volume = value;
    if (value === 0) {
      handleMuteAudio();
    }
  };

  const handleMuteAudio = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const handleSetAudio = (track) => {
    const isActiveTrack = audioRef.current.src === track.preview_url;
    audioRef.current.volume = volume;
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
      value={{
        isPlaying,
        currentlyPlaying,
        updateAudio: handleSetAudio,
        handleSetVolume,
        currentVolume: volume,
        isMuted,
        handleSetMute: handleMuteAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
