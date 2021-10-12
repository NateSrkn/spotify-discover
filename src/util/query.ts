import { AxiosError, AxiosResponse } from "axios";
import { useQuery, UseQueryResult } from "react-query";
import { request } from "./api";
import { ExpandedArtist, SimplifiedCurrentPlaying } from "./types/spotify";
import { queryClient } from "../pages/_app";
export const useNowPlaying = (): UseQueryResult<
  SimplifiedCurrentPlaying,
  AxiosError
> => {
  return useQuery(
    "nowPlaying",
    async () => {
      const { data } = await request({
        baseURL: "/api/",
        url: "me/now_playing",
      });
      return data || { isListening: false };
    },
    {
      placeholderData: { data: { isListening: false } },
      staleTime: 60 * 1000,
    }
  );
};

export const useArtist = (
  id?: string | undefined,
  placeholderData?: Partial<ExpandedArtist>,
  isEnabled?: boolean
): UseQueryResult<ExpandedArtist> => {
  return useQuery(
    ["artist", id],
    async () => {
      const { data } = await request({
        baseURL: "/api/",
        url: `artist`,
        params: {
          id,
        },
      });
      return data;
    },
    {
      placeholderData,
      staleTime: Infinity,
      cacheTime: Infinity,
      enabled: isEnabled,
    }
  );
};

export const prefetchArtist = async (id: string) => {
  let value: ExpandedArtist = queryClient.getQueryData(["artist", id]);
  if (!value) {
    await queryClient.prefetchQuery(
      ["artist", id],
      async () => {
        const data: AxiosResponse<ExpandedArtist> = await request({
          baseURL: "/api/",
          url: `artist`,
          params: { id },
        });
        value = data.data;
        return value;
      },
      {
        staleTime: Infinity,
      }
    );
  }
  return value;
};

export const checkForData = (key) => {
  return queryClient.getQueryData(key);
};
