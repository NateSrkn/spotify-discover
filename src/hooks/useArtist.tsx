import { AxiosPromise } from "axios";
import { QueryClient, useQuery, useQueryClient, UseQueryResult } from "react-query";
import { request } from "../util/api";
import { chunkArray } from "../util/helpers";
import { ExpandedArtist } from "../util/types/spotify";
import { getAlbum } from "./useAlbum";
export const getArtist = (id: string): AxiosPromise<ExpandedArtist> =>
  request({ baseURL: "api", url: "artist", params: { id } });

export const useArtist = ({
  artist,
  isEnabled,
}: {
  artist: Partial<ExpandedArtist>;
  isEnabled: boolean;
}): UseQueryResult<ExpandedArtist> => {
  const queryClient = useQueryClient();
  return useQuery(["artist", artist.id], () => artistQuery(artist.id, queryClient), {
    enabled: isEnabled,
    placeholderData: artist,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

export const prefetchArtist = (client, id: string) => {
  if (client.getQueryData(["artist", id])) return;
  client.prefetchQuery(["artist", id], () => artistQuery(id, client), {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};

const artistQuery = async (id, client: QueryClient) => {
  const { data } = await getArtist(id);
  let ids = Object.values(data.collection)
    .map((value) => value.ids)
    .flat();
  const albums = await Promise.all(chunkArray(ids, 20).map((chunk) => getAlbum(chunk.join(","))));
  albums.forEach((album) => {
    const { data } = album;
    if (Array.isArray(data.albums)) {
      data.albums.forEach((a) => {
        client.setQueryData(["album", a.id], a);
      });
    } else {
      client.setQueryData(["album", data.id], data);
    }
  });
  return data;
};

const uniqBy = (a, key) => {
  let seen = new Set();
  return a.filter((item) => {
    let k = key(item);
    return seen.has(k) ? false : seen.add(k);
  });
};
