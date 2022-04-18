import useSWR from "swr";
import { NowPlaying } from "../util/types/spotify";
import { fetcher } from "../util/api";
import { requests } from "../util/helpers";

export const useNowPlaying = () =>
  useSWR<NowPlaying>(requests["now_playing"], (url) => fetcher({ url, useCache: false }));
