import { useQuery } from "react-query";
import { request } from "../util/api";

export const getArtist = (id: string) =>
  request({ baseURL: "api", url: "artist", params: { id } });

export const useArtist = ({ id, isEnabled, placeholderData }) =>
  useQuery(
    ["artist", id],
    async () => {
      const { data } = await getArtist(id);
      return data;
    },
    {
      enabled: isEnabled,
      placeholderData,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

export const prefetchArtist = (client, id: string) => {
  if (client.getQueryData(["artist", id])) return;
  client.prefetchQuery(
    ["artist", id],
    async () => {
      const { data } = await getArtist(id);
      return data;
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
};
