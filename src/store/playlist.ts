import { create } from "zustand/react";
import { persist, createJSONStorage } from "zustand/middleware";
import dayjs from "dayjs";
import TrackObjectFull = SpotifyApi.TrackObjectFull;
import TrackObjectSimplified = SpotifyApi.TrackObjectSimplified;

type Track = TrackObjectFull | TrackObjectSimplified;
type PlaylistState = {
  name: string;
  tracks: Record<string, Track>;
  actions: {
    updateName: (name: string) => void;
    add: (track: Track) => void;
    remove: (id: string) => void;
    reset: () => void;
  };
};

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      name: `Crumbs ${dayjs().format("YYYY/MM/DD")}`,
      tracks: {},
      actions: {
        updateName: (name: string) => {
          return set({ name });
        },
        add: (track) => {
          if (get().tracks[track.id]) return;
          return set((state) => {
            return {
              tracks: {
                ...state.tracks,
                [track.id]: track,
              },
            };
          });
        },
        remove: (id) => {
          if (!get().tracks[id]) return;
          return set((state) => {
            const tracks = { ...state.tracks };
            delete tracks[id];
            return {
              tracks,
            };
          });
        },
        reset: () => {
          return set({
            name: `Crumbs ${dayjs().format("YYYY/MM/DD")}`,
            tracks: {},
          });
        },
      },
    }),
    {
      name: "playlist",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        name: state.name,
        tracks: state.tracks,
      }),
    },
  ),
);
