import { AxiosPromise } from "axios";
import { useQuery } from "react-query";
import { request } from "../util/api";
import {
  Options,
  PagingObject,
  SimpleArtist,
  SimpleTrack,
} from "../util/types/spotify";

export const requestTopItems = ({
  type,
  time_range,
}): AxiosPromise<PagingObject<SimpleArtist | SimpleTrack>> =>
  request({
    baseURL: "/api",
    url: "me/top",
    params: { type, time_range },
  });

export const useTopItems = (
  type: Options["type"],
  time_range: Options["termLength"]
) => {
  return useQuery(
    [type, time_range],
    async () => {
      console.log(type, time_range);
      const { data } = await requestTopItems({ type, time_range });
      return data;
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
};
