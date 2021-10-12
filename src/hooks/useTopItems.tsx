import { useQuery } from "react-query";
import { request } from "../util/api";

export const requestTopItems = ({ type, time_range }) =>
  request({ baseURL: "/api", url: "me/top", params: { type, time_range } });

export const useTopItems = (
  type: "artists" | "tracks",
  time_range: "short_term" | "medium_term" | "long_term"
) => {
  return useQuery(
    [type, time_range],
    async () => {
      const { data } = await requestTopItems({ type, time_range });
      return data;
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
};
