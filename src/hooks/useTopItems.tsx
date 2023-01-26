import useSWRInfinite from "swr/infinite";
import { fetcher } from "../util/api";
import { requests } from "../util/helpers";
import { Options, PagingObject, SimpleArtist, SimpleTrack } from "../util/types/spotify";

export const useTopItems = (type: Options["type"], time_range: Options["time_range"]) => {
  const getKey = (index, prev) => {
    if (hasNext(prev)) {
      return null;
    }

    return `${requests["user_top"](type, time_range)}&offset=${index * 20}`;
  };
  const hasNext = (prev) => prev && !prev.next;
  return {
    ...useSWRInfinite<PagingObject<SimpleArtist | SimpleTrack>>(getKey, (url) => fetcher({ url }), {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }),
    hasNext,
  };
};
