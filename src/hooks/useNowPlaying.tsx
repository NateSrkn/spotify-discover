import useSWR from "swr";
import { NowPlaying } from "../util/types/spotify";
import { fetcher } from "../util/api";
import { requests } from "../util/helpers";

export const useNowPlaying = (isEnabled = true) =>
  useSWR<NowPlaying>(isEnabled ? requests["now_playing"] : null, (url) => fetcher({ url }));
