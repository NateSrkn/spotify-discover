import { request } from "./api";
import { Session } from "next-auth";

import {
  Artist,
  Track,
  SimpleTrack,
  SimpleArtist,
  Album,
  Collection,
  PagingObject,
  Options,
  SimplifiedAlbumObject,
  TrackBase,
  ArtistBase,
  AlbumBase,
} from "./types/spotify";
import { sanitizeObject } from "./helpers";
import { AxiosPromise } from "axios";

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const client_id = process.env.NEXT_PUBLIC_CLIENT_ID;
const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI;
const auth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
export async function refreshToken(token) {
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
        redirect_uri,
      }),
    });
    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const getNowPlaying = async (session: Session) => {
  const { data } = await request({
    url: "/me/player/currently-playing",
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
  if (!data || data.currently_playing_type === "episode") {
    return {
      isListening: false,
    };
  }
  const artistString = data.item.artists
    .map((artist) => artist.name)
    .join(", ");
  return {
    isPlaying: data.is_playing,
    isListening: true,
    name: data.item.name,
    href: data.item.external_urls.spotify,
    album: data.item.album.name,
    progress: data.progress_ms,
    type: data.currently_playing_type,
    context: data.context,
    compact: `${data.item.name} - ${artistString}`,
    artists: {
      string: artistString,
      array: data.item.artists,
    },
  };
};

export const getRecentlyPlayed = async (session: Session) => {
  const { data } = await request({
    url: "me/player/recently-played",
    headers: { Authorization: `Bearer ${session.accessToken}` },
    params: {
      limit: 10,
    },
  });
  return data || {};
};

const buildArtistRequests = (artist_id) => {
  const base = `artists`;
  const requests = ["", "related-artists", "top-tracks", "albums"];

  return requests.map((request) => {
    let params: { [key: string]: any } = {};
    if (["top-tracks"].includes(request)) {
      params.market = "from_token";
    }
    return {
      url: `${base}/${artist_id}/${request}`,
      params,
    };
  });
};

export const getArtistData = async (artist_id, session) => {
  let configs = buildArtistRequests(artist_id);
  const requests = configs.map((config) =>
    request({
      ...config,
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
  );
  const [artist, related_artists, top_tracks, albums] = await Promise.all(
    requests
  );
  return {
    ...simplifyStructure(artist.data),
    related_artists: related_artists.data.artists.map((a) =>
      simplifyStructure(a)
    ),
    tracks: top_tracks.data.tracks.map((t) => simplifyStructure(t)),
    collection: albums.data.items
      .filter(({ available_markets }) => available_markets.includes("US"))
      .reduce(albumReducer, {}),
  };
};

export const getTopItems = async (
  options: { type: Options["type"]; time_range: Options["termLength"] },
  session: Session
): Promise<PagingObject<SimpleArtist | SimpleTrack>> => {
  const { type = "artists", time_range = "short_term" } = options;
  const { data } = await request({
    url: `/me/top/${type}`,
    headers: { Authorization: `Bearer ${session.accessToken}` },
    params: {
      time_range,
      limit: 20,
    },
  });

  data.items = data.items.map((item: Artist | Track) =>
    simplifyStructure(item)
  );
  return data;
};

export const getAlbum = (id, session): AxiosPromise<Album | Album[]> => {
  const isMultiple = id.includes(",");
  const params: { [key: string]: any } = {};
  if (isMultiple) {
    params.ids = id;
  }
  return request({
    url: isMultiple ? `/albums` : `/albums/${id}`,
    params,
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });
};

export const albumReducer = (acc, album: Album): Collection => {
  if (!acc[album.album_type]) {
    acc[album.album_type] = {
      ids: [],
      list: [],
    };
  }
  acc[album.album_type].ids.push(album.id);
  acc[album.album_type].list.push(album);
  return acc;
};

export const simplifyStructure = (data: Partial<Artist | Track | Album>) => {
  const base = {
    name: data.name,
    id: data.id,
    type: data.type,
    href: data.href,
  };
  let expanded = {};
  switch (data.type) {
    case "artist": {
      expanded = {
        popularity: "popularity" in data ? data.popularity : undefined,
        followers: "followers" in data ? data.followers.total : undefined,
        genres: data.genres,
        images: data.images,
      };
      break;
    }
    case "album": {
      expanded = {
        artists: data.artists.map((artist) => simplifyStructure(artist)),
        images: data.images,
      };
      break;
    }
    case "track": {
      expanded = {
        popularity: data.popularity,
        preview_url: data.preview_url,
        artists: data.artists.map((artist) => simplifyStructure(artist)),
        images: data.album.images,
      };
    }
  }
  return sanitizeObject({
    ...base,
    ...expanded,
  });
};
