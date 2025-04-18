import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { TrendingListProps } from "@/components/Trending";
import type { Page, Track, Artist } from "@spotify/web-api-ts-sdk";
import ky from "ky";
import ArtistObjectFull = SpotifyApi.ArtistObjectFull;
import { z } from "zod";

export const BASE_URL = "https://api.spotify.com/v1";

export const TRENDING_URL = (params: TrendingListProps) =>
  `${BASE_URL}/me/top/${params.type}?time_range=${params.time_range}`;

export const withAuthHeader = (
  token: string,
  rest?: Record<string, unknown>,
) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      ...rest,
    },
  };
};
export const ARTIST_URL = (id: string) => `${BASE_URL}/artists/${id}`;
export const ME_URL = `${BASE_URL}/me`;
export const ALBUM_URL = (id: string) => `${BASE_URL}/albums/${id}`;

export const spotify_queries = {
  now_playing: () => {
    const session = useSession();
    return queryOptions({
      queryKey: ["now_playing"],
      queryFn: async () => {
        const response = await ky.get<SpotifyApi.CurrentlyPlayingResponse>(
          `${BASE_URL}/me/player/currently-playing`,
          withAuthHeader(session?.data.access_token),
        );
        return response.json();
      },
      enabled: !!session?.data,
      staleTime: 0,
    });
  },
  trending: ({
    time_range = "short_term",
    type = "tracks",
  }: TrendingListProps) => {
    const session = useSession();
    return infiniteQueryOptions({
      queryKey: ["trending", time_range, type],
      queryFn: async ({ pageParam }) => {
        const response = await ky.get<Page<Track> | Page<Artist>>(
          pageParam,
          withAuthHeader(session?.data.access_token),
        );
        return response.json();
      },
      enabled: !!session?.data,
      initialPageParam: TRENDING_URL({ time_range, type }),
      getNextPageParam: (lastPage) => lastPage.next,
      staleTime: Infinity,
    });
  },
};

enum AlbumType {
  "album" = "album",
  "single" = "single",
  "compilation" = "compilation",
}
const AlbumTypeSchema = z.nativeEnum(AlbumType);

const albumParams = z.object({
  include_groups: z.array(AlbumTypeSchema).default([AlbumType.album]),
  market: z.string().optional(),
  limit: z.number().default(20),
  offset: z.number().default(0),
});
type ArtistAlbumsParams = z.infer<typeof albumParams>;
export const artist_queries = {
  artist: (id: string) => {
    const session = useSession();
    return queryOptions({
      queryKey: ["artist", id],
      queryFn: async () => {
        const response = await ky.get<ArtistObjectFull>(
          ARTIST_URL(id),
          withAuthHeader(session?.data.access_token),
        );
        return response.json();
      },
      enabled: !!session?.data,
      staleTime: Infinity,
    });
  },
  albums: (id: string, filter: ArtistAlbumsParams = {}) => {
    const session = useSession();
    const { data: searchParams } = albumParams.safeParse(filter);
    console.log(searchParams);
    return infiniteQueryOptions({
      queryKey: ["artist", id, "albums", filter],
      queryFn: async ({ pageParam }) => {
        const response = await ky.get<
          SpotifyApi.PagingObject<SpotifyApi.AlbumObjectSimplified>
        >(pageParam, {
          ...withAuthHeader(session?.data.access_token),
          searchParams: {
            include_groups: searchParams?.include_groups.join(","),
            market: searchParams?.market,
            limit: searchParams?.limit,
            offset: searchParams?.offset,
          },
        });
        return response.json();
      },
      initialPageParam: `${ARTIST_URL(id)}/albums`,
      getNextPageParam: (lastPage) => lastPage.next,
      enabled: !!session?.data,
      staleTime: Infinity,
    });
  },
  top_tracks: (id: string) => {
    const session = useSession();
    return queryOptions({
      queryKey: ["artist", id, "top_tracks"],
      queryFn: async () => {
        const response = await ky.get<{ tracks: Track[] }>(
          `${ARTIST_URL(id)}/top-tracks`,
          withAuthHeader(session?.data.access_token),
        );
        return response.json();
      },
      enabled: !!session?.data,
      staleTime: Infinity,
    });
  },
  related_artists: (id: string) => {
    const session = useSession();
    return queryOptions({
      queryKey: ["artist", id, "related_artists"],
      queryFn: async () => {
        const response = await ky.get<{
          artists: ArtistObjectFull[];
        }>(
          `${ARTIST_URL(id)}/related-artists`,
          withAuthHeader(session?.data.access_token),
        );
        return response.json();
      },
      enabled: !!session?.data,
      staleTime: Infinity,
    });
  },
};

export const album_queries = {
  album: (id: string) => {
    const session = useSession();
    return queryOptions({
      queryKey: ["album", id],
      queryFn: async () => {
        const response = await ky.get<SpotifyApi.AlbumObjectFull>(
          `${BASE_URL}/albums/${id}`,
          withAuthHeader(session?.data.access_token),
        );
        return response.json();
      },
      enabled: !!id && !!session?.data,
      staleTime: Infinity,
    });
  },
  tracks: (id: string) => {
    const session = useSession();
    return infiniteQueryOptions({
      queryKey: ["album", id, "tracks"],
      queryFn: async ({ pageParam }) => {
        const response = await ky.get<
          SpotifyApi.PagingObject<SpotifyApi.TrackObjectFull>
        >(pageParam, withAuthHeader(session?.data.access_token));
        return response.json();
      },
      initialPageParam: `${BASE_URL}/albums/${id}/tracks`,
      getNextPageParam: (lastPage) => lastPage.next,
      enabled: !!id && !!session?.data,
      staleTime: Infinity,
    });
  },
};

export const user_queries = {
  following_artist: (id: string, token?: string) => {
    return queryOptions({
      queryKey: ["following", id],
      queryFn: async () => {
        const response = await ky.get<boolean[]>(
          `${ME_URL}/following/contains`,
          {
            ...withAuthHeader(token),
            searchParams: {
              ids: id,
              type: "artist",
            },
          },
        );
        const [data] = await response.json();
        return data;
      },
      enabled: !!id && !!token,
      staleTime: Infinity,
    });
  },
};
