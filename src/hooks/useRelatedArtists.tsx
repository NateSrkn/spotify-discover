import useSWRImmutable from "swr/immutable";
import { fetcher } from "../util/api";
import { requests } from "../util/helpers";
import { RelatedArtists } from "../util/types/spotify";
export const useRelatedArtists = (id: string, isEnabled = true) =>
  useSWRImmutable<RelatedArtists>(
    isEnabled ? requests["artist_extended"](id, "related-artists") : null,
    (url) =>
      fetcher({
        url,
      })
  );
