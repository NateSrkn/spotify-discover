import useSWRImmutable from "swr/immutable";
import { fetcher } from "../util/api";
import { requests } from "../util/helpers";
import { Options, PagingObject, SimpleArtist, SimpleTrack } from "../util/types/spotify";

export const useTopItems = (type: Options["type"], time_range: Options["time_range"]) =>
  useSWRImmutable<PagingObject<SimpleArtist | SimpleTrack>>(
    requests["user_top"](type, time_range),
    (url) => fetcher({ url })
  );
