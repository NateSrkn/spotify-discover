import { useQuery, UseQueryResult } from "react-query";
import { request } from "../util/api";
import { Album } from "../util/types/spotify";

export const getAlbum = (id: string) =>
  request({ baseURL: "api", url: "album", params: { id } });

interface UseAlbumProps {
  album: Partial<Album>;
  isEnabled: boolean;
}
export const useAlbum = ({
  album,
  isEnabled,
}: UseAlbumProps): UseQueryResult<Album> => {
  return useQuery(
    ["album", album?.id],
    async () => {
      const { data } = await getAlbum(album.id);
      return data;
    },
    {
      enabled: isEnabled,
      placeholderData: album,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
};
