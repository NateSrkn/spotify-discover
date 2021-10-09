export interface PagingObject {
  limit: number;
  href: string;
  next?: string;
  offset: number;
  previous?: string;
  items: Array<{ [key: string]: any }>;
}

export interface CurrentPlaying {
  actions: Disallows;
  context?: Context;
  currently_playing_type: "track" | "episode";
  device: Device;
  is_playing: boolean;
  item?: Episode | Track;
  progress_ms?: number;
  repeat_state: string;
  shuffle_state: string;
  timestamp: number;
}

export interface SimplifiedCurrentPlaying {
  isListening: boolean;
  isPlaying?: boolean;
  name?: string;
  progress?: string;
  href?: string;
  type?: "track" | "episode";
  context?: Context;
  compact?: string;
  artists?: {
    string: string;
    array: SimplifiedArtist[];
  };
}

export interface SimplifiedTopItem {
  name: string;
  id: string;
  duration?: string;
  images: SpotifyImage[];
  album?: SimplifiedAlbumObject;
  popularity: number;
  followers?: number;
  type: "track" | "artist";
  genres?: {
    string: string;
    array: string[];
  };
  artists?: {
    string: string;
    array: SimplifiedArtist[];
  };
}

export interface Episode {
  audio_preview_url?: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: External_URLS;
  href: string;
  id: string;
  images: SpotifyImage[];
  is_externally_hosted: boolean;
  is_playable: boolean;
  language: string;
  languages: string[];
  name: string;
  release_date: string;
  release_date_precision: ReleasePrecision;
  resume_point?: ResumePoint;
  show: SimplifiedShow;
  type: string;
  uri: string;
}

export interface SimplifiedEpisodeObject {
  audio_preview_url?: string;
  duration_ms: number;
  explicit: boolean;
  external_urls: External_URLS;
  href: string;
  id: string;
  images: SpotifyImage[];
  is_externally_hosted: boolean;
  is_playable: boolean;
  language: string;
  languages: string[];
  name: string;
  release_date: string;
  release_date_precision: ReleasePrecision;
  resume_point?: ResumePoint;
  type: string;
  uri: string;
}

export interface Show {
  available_markets: string[];
  copyrights: Copyright[];
  description: string;
  episodes: SimplifiedEpisodeObject[];
  explicit: boolean;
  external_urls: External_URLS;
  href: string;
  id: string;
  images: SpotifyImage[];
  is_externally_hosted?: boolean;
  languages: string[];
  media_type: string;
  name: string;
  publisher: string;
  type: string;
  uri: string;
}

export interface SimplifiedShow {
  available_markets: string[];
  copyrights: Copyright[];
  description: string;
  explicit: boolean;
  external_urls: External_URLS;
  href: string;
  id: string;
  images: SpotifyImage[];
  is_externally_hosted?: boolean;
  languages: string[];
  media_type: string;
  name: string;
  type: string;
  uri: string;
}

export interface Track {
  album: SimplifiedAlbumObject;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: External_IDS;
  external_urls: External_URLS;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: "track";
  uri: string;
  relatedArtists?: Artist[];
}

export interface SimplifiedTrack {
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: External_URLS;
  href: string;
  id: string;
  is_local: boolean;
  is_playable: boolean;
  linked_from: LinkedTrack;
  name: string;
  preview_url: string;
  restriction: RestrictionObject;
  track_number: number;
  type: string;
  uri: string;
}

export interface Artist {
  palette?: any;
  external_urls: External_URLS;
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  images: SpotifyImage[];
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
  popularity: number;
  relatedArtists?: Artist[];
}

export interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  copyrights: Copyright[];
  external_urls: External_URLS;
  external_ids: External_IDS;
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  popularity: number;
  release_date: string;
  release_date_precision: ReleasePrecision;
  tracks: SimplifiedTrack[];
  type: string;
  uri: string;
}

export interface SimplifiedAlbumObject {
  album_group: "album" | "single" | "compilation" | "appears_on";
  album_type: "album" | "single" | "compilation";
  artists: SimplifiedArtist[];
  available_markets: string[];
  external_urls: External_URLS;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: ReleasePrecision;
  restrictions: RestrictionObject;
  type: string;
  uri: string;
}

export interface SimplifiedArtist {
  external_urls: External_URLS;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface Device {
  id?: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

export type External_URLS = {
  spotify: string;
};

export type External_IDS = {
  ean: string;
  isrc: string;
  upc: string;
};

export type SpotifyImage = {
  height?: number;
  width?: number;
  url: string;
};

export interface Context {
  external_urls: External_URLS;
  href: string;
  type: string;
  uri: string;
}

export interface Copyright {
  text: string;
  type: string;
}

export interface RestrictionObject {
  reason: {
    market: string;
    product: string;
    explicit: string;
  };
}

export interface LinkedTrack {
  external_urls: External_URLS;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface ResumePoint {
  fully_played: boolean;
  resume_position_ms: number;
}

export interface Disallows {
  disallows: {
    resuming: boolean;
    skipping_prev: boolean;
    toggling_repeat_context: boolean;
    toggling_repeat_track: boolean;
    toggling_shuffle: boolean;
  };
}

export type ReleasePrecision = "year" | "month" | "day";

export interface ExpandedArtist {
  artist: Artist;
  related_artists: Artist[];
  top_tracks: Track[];
  albums: SimplifiedAlbumObject[];
}
