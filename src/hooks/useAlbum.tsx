import { useQuery, useQueryClient, UseQueryResult } from "react-query";
import { request } from "../util/api";
import { Album } from "../util/types/spotify";

export const getAlbum = (id: string) => request({ baseURL: "api", url: "album", params: { id } });

interface UseAlbumProps {
  album: Partial<Album>;
  isEnabled: boolean;
}
export const useAlbum = ({ album, isEnabled }: UseAlbumProps): UseQueryResult<Album> => {
  const queryClient = useQueryClient();
  return useQuery(
    ["album", album?.id],
    async () => {
      const { data } = await getAlbum(album.id);
      return data;
    },
    {
      enabled: isEnabled || queryClient.getQueryData(["album", album?.id]) === undefined,
      placeholderData: album,
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnWindowFocus: false,
    }
  );
};
