import useSWRImmutable from "swr/immutable";
import { fetcher } from "../util/api";
import { requests } from "../util/helpers";

export const useAlbum = (id: string) =>
  useSWRImmutable(id ? requests["album"](id) : null, (url) => fetcher({ url }));
