import { useQuery, UseQueryResult } from "react-query";
import { request } from "../util/api";
import { SimpleCurrentPlaying } from "../util/types/spotify";

export const getNowPlaying = () =>
  request({ baseURL: "api", url: "me/now_playing" });

export const useNowPlaying = (): UseQueryResult<
  Partial<SimpleCurrentPlaying>
> =>
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
