import { useQuery } from "react-query";
import { request } from "../util/api";

export const getNowPlaying = () =>
  request({ baseURL: "api", url: "me/now_playing" });

export const useNowPlaying = () =>
  useQuery(
    "nowPlaying",
    async () => {
      const { data } = await getNowPlaying();
      return data || { isListening: false };
    },
    {
      placeholderData: { isListening: false },
      staleTime: 60 * 1000,
    }
  );
