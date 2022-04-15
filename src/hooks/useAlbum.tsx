import useSWRImmutable from "swr/immutable";
import { fetcher } from "../util/api";
import { requests } from "../util/helpers";
import { Album } from "../util/types/spotify";

export const useAlbum = (id: string) =>
  useSWRImmutable<Album>(id ? requests["album"](id) : null, (url) => fetcher({ url }));
