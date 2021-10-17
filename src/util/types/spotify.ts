export interface PagingObject<Type> {
  limit: number;
  href: string;
  next?: string;
  offset: number;
  previous?: string;
  items: Array<Type>;
}

export interface AlbumBase {
  album_type: "album" | "single" | "compilation";
  available_markets: Array<string>;
  external_urls: External_URLS;
  href: string;
  id: string;
  images: Array<SpotifyImage>;
  release_date: string;
  release_date_precision: ReleasePrecision;
  restrictions: RestrictionObject;
  total_tracks: number;
  type: "album";
  uri: string;
  name: string;
}

export interface TrackBase {
  artists: Array<ArtistBase>;
  available_markets: Array<string>;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: External_URLS;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  preview_url: string;
  track_number: number;
  type: "track";
  uri: string;
  linked_from: LinkedTrack;
  is_playable: boolean;
}

export interface ArtistBase {
  external_urls: External_URLS;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}
export interface CurrentPlaying {
  actions: Disallows;
  context?: Context;
  currently_playing_type: "track" | "episode";
  device: Device;
  is_playing: boolean;
  item?: Track;
  progress_ms?: number;
  repeat_state: string;
  shuffle_state: string;
  timestamp: number;
}

export interface SimpleItem {
  name: string;
  id: string;
  href: string;
}

export interface SimpleArtist extends SimpleItem {
  type: "artist";
  popularity: number;
  followers: number;
  genres: Array<string>;
  images: SpotifyImage[];
}

export interface SimpleTrack extends SimpleItem {
  type: "track";
  popularity: number;
  preview_url: string;
  artists: SimpleArtist[];
  images: SpotifyImage[];
}
export interface SimpleCurrentPlaying {
  isListening: boolean;
  isPlaying?: boolean;
  name?: string;
  progress?: string;
  href?: string;
  type?: "track" | "episode";
  context?: Context;
  compact?: string;
  artists?: SimpleArtist[];
}

export interface Track extends TrackBase {
  album: AlbumBase;
  artists: Artist[];
  external_ids: External_IDS;
  popularity: number;
}

export interface Artist extends ArtistBase {
  external_urls: External_URLS;
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  images: SpotifyImage[];
  popularity: number;
}

export interface Album extends AlbumBase {
  artists: ArtistBase[];
  available_markets: string[];
  copyrights: Copyright[];
  external_ids: External_IDS;
  genres: string[];
  popularity: number;
  tracks: PagingObject<Track>;
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

export interface ExpandedArtist extends SimpleArtist {
  related_artists: Artist[];
  tracks: SimpleTrack[];
  collection: Collection;
}

export interface Collection {
  album?: {
    id: string[];
    list: Album[];
  };
  single?: {
    id: string[];
    list: Album[];
  };
  compilation?: {
    id: string[];
    list: Album[];
  };
}

export type TermLengths = ["short_term", "medium_term", "long_term"];
export type TypesList = ["artists", "tracks"];
export interface Options {
  termLength: TermLengths[number];
  type: TypesList[number];
}
