import { AxiosPromise } from "axios";
import { useQuery, useInfiniteQuery } from "react-query";
import { request } from "../util/api";
import { Options, PagingObject, SimpleArtist, SimpleTrack } from "../util/types/spotify";

export const requestTopItems = ({
  type,
  time_range,
  offset,
}): AxiosPromise<PagingObject<SimpleArtist | SimpleTrack>> =>
  request({
    baseURL: "/api",
    url: "me/top",
    params: { type, time_range, offset },
  });

export const useInfiniteTopItems = (type: Options["type"], time_range: Options["termLength"]) => {
  return useInfiniteQuery(
    [type, time_range],
    ({ pageParam }) => fetchItemsQuery(type, time_range, pageParam),
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      getNextPageParam: ({ limit, offset, total }) =>
        total < offset + limit ? undefined : offset + limit,
    }
  );
};

const fetchItemsQuery = async (type, time_range, next) => {
  const { data } = await requestTopItems({ type, time_range, offset: next });
  return data;
};
