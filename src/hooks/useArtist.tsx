import useSWRImmutable from "swr/immutable";
import { fetcher } from "../util/api";
import { requests } from "../util/helpers";
import { SpotifyImage } from "../util/types/spotify";

export const useArtist = (id: string) =>
  useSWRImmutable<Artist>(id ? requests["artist"](id) : null, (url) => fetcher({ url }));

export interface Artist {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  popularity: number;
  type: "artist";
  uri: string;
}
