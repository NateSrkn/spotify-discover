import { request } from "./api";
import { Session } from "next-auth";

import { Artist, Track, SimplifiedTopItem } from "./types/spotify";
import { sanitizeObject } from "./helpers";

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
    artist: {
      name: artist.data.name,
      id: artist.data.id,
      type: artist.data.type,
      href: artist.data.external_urls.spotify,
      followers: artist.data.followers.total,
      genres: {
        string: artist.data.genres.join(", "),
        array: artist.data.genres,
      },
      images: artist.data.images,
      popularity: artist.data.popularity,
    } as SimplifiedTopItem,
    related_artists: related_artists.data.artists as Artist[],
    top_tracks: top_tracks.data.tracks as Track[],
    collection: albums.data.items
      .filter(({ available_markets }) => available_markets.includes("US"))
      .reduce((acc, album) => {
        if (!acc[album.album_type]) {
          acc[album.album_type] = [];
        }
        acc[album.album_type].push(album);
        return acc;
      }, {}),
  };
};

export const getTopItems = async (
  options: {
    type: "tracks" | "artists";
    time_range: "long_term" | "medium_term" | "short_term";
  },
  session: Session
) => {
  const { type = "tracks", time_range = "short_term" } = options;
  const { data } = await request({
    url: `/me/top/${type}`,
    headers: { Authorization: `Bearer ${session.accessToken}` },
    params: {
      time_range,
      limit: 20,
    },
  });
  if (!data) return {};
  const items = data.items.map((item: Artist | Track) => {
    const isTrack = predicateTrack(item);
    return sanitizeObject({
      name: item.name,
      id: item.id,
      duration: isTrack ? item.duration_ms : undefined,
      images: isTrack ? item.album.images : item.images,
      album: isTrack ? item.album.name : undefined,
      popularity: item.popularity,
      followers: isTrack ? undefined : item.followers.total,
      preview_url: isTrack ? item.preview_url : undefined,
      type: item.type,
      genres: isTrack
        ? undefined
        : { string: item.genres.join(", "), array: item.genres },
      artists: isTrack
        ? {
            string: item.artists.map((artist) => artist.name).join(", "),
            array: item.artists,
          }
        : undefined,
    });
  });
  data.items = items;
  return data;
};

export const predicateTrack = (data): data is Track => data.type === "track";
