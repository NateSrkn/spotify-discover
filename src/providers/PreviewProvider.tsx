"use client";
import { createContext, useEffect, useRef, useState } from "react";

import TrackObjectFull = SpotifyApi.TrackObjectFull;
import TrackObjectSimplified = SpotifyApi.TrackObjectSimplified;

type Track = TrackObjectFull | TrackObjectSimplified;
type AudioContextType = {
  pause: () => void;
  play: () => void;
  toggle: () => void;
  set: (track: Track) => void;
  queue: (track: Track[]) => void;
  playing: boolean;
  muted: boolean;
  track: Track | null;
};
export const PreviewAudio = createContext({
  track: null,
  playing: false,
  muted: false,
  audio: null,
  queue: () => {},
  set: () => {},
  play: () => {},
  pause: () => {},
  toggle: () => {},
} as AudioContextType);

export const PreviewProvider = ({ children }) => {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);

  useEffect(() => {
    if (!track) return;
    if (!audio.current) {
      audio.current = new Audio();
    }
    audio.current.src = track.preview_url;
    audio.current.volume = audio.current?.volume || 0.5;
    const controller = new AbortController();
    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    audio.current?.addEventListener("play", handlePlay, {
      signal: controller.signal,
    });
    audio.current?.addEventListener("pause", handlePause, {
      signal: controller.signal,
    });
    audio.current?.addEventListener(
      "ended",
      () => {
        if (queue.length > 0) {
          setQueue((current) => {
            const tracks = [...current];
            setTrack(tracks.shift());
            return [...tracks];
          });
        } else {
          setPlaying(false);
          setTrack(null);
        }
      },
      {
        signal: controller.signal,
      },
    );
    audio.current.addEventListener(
      "canplaythrough",
      async () => {
        await audio.current?.play();
      },
      {
        signal: controller.signal,
      },
    );
    audio.current?.addEventListener("error", handlePause, {
      signal: controller.signal,
    });
    return () => {
      controller.abort();
      if (audio.current) {
        audio.current.pause();
        audio.current.src = "";
        audio.current = null;
      }
    };
  }, [track, queue]);

  const setCurrentTrack = (next: Track) => {
    if (audio.current && track?.preview_url === next.preview_url) {
      if (audio.current.paused) {
        return void audio.current?.play();
      }
      return void audio.current?.pause();
    }
    setTrack(next);
  };

  const play = () => {
    void audio.current?.play();
  };

  const pause = () => {
    audio.current?.pause();
  };

  const toggle = async () => {
    if (audio.current?.paused) {
      await audio.current?.play();
    } else {
      audio.current?.pause();
    }
  };

  return (
    <PreviewAudio.Provider
      value={{
        set: setCurrentTrack,
        queue: (tracks) => {
          setQueue((current) => {
            const queue = [...tracks];
            setCurrentTrack(queue.shift());
            return [...current, ...queue];
          });
        },
        playing,
        pause,
        play,
        muted: audio.current?.muted,
        toggle,
        track,
      }}
    >
      {children}
    </PreviewAudio.Provider>
  );
};
