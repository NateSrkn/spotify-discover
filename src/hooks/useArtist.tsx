import { AxiosPromise } from "axios";
import {
  QueryClient,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import { request } from "../util/api";
import { albumReducer } from "../util/spotify";
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
  return useQuery(
    ["artist", artist.id],
    () => artistQuery(artist.id, queryClient),
    {
      enabled: isEnabled,
      placeholderData: artist,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
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
  const ids = Object.keys(data.collection)
    .map((key) => data.collection[key].ids)
    .flat()
    .join(",");
  const { data: albumData } = await getAlbum(ids);
  if (albumData.albums) {
    albumData.albums.forEach((album) => {
      client.setQueryData(["album", album.id], album);
    });
    data.collection = albumData.albums.reduce(albumReducer, {});
  }
  return data;
};
