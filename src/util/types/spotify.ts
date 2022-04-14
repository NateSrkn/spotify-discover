export interface PagingObject<Type> {
  limit: number;
  href: string;
  next?: string;
  offset: number;
  previous?: string;
  items: Array<Type>;
  total: number;
}

export interface AlbumBase {
  album_type: "album" | "single" | "compilation";
  available_markets: Array<string>;
  external_urls: ExternalURLs;
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
  external_urls: ExternalURLs;
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
  external_urls: ExternalURLs;
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
  external_ids: ExternalIDs;
  popularity: number;
}

export interface Artist extends ArtistBase {
  external_urls: ExternalURLs;
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
  external_ids: ExternalIDs;
  genres: string[];
  popularity: number;
  tracks: PagingObject<Track>;
  album_group?: string;
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

export type ExternalURLs = {
  spotify: string;
};

export type ExternalIDs = {
  ean: string;
  isrc: string;
  upc: string;
};

export type SpotifyImage = {
  height: number | null;
  width: number | null;
  url: string;
};

export interface Context {
  external_urls: ExternalURLs;
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
  external_urls: ExternalURLs;
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

export interface Options {
  time_range: TermLengths[number];
  type: TypesList[number];
}
export type ArtistPathOptions = ["albums" | "related-artists" | "top-tracks"];

export enum TypesList {
  ARTISTS = "artists",
  TRACKS = "tracks",
}

export enum TermLengths {
  SHORT_TERM = "short_term",
  MEDIUM_TERM = "medium_term",
  LONG_TERM = "long_term",
}
export interface SimpleItem {
  name: string;
  id: string;
  href: string;
}
export interface SimpleArtist extends SimpleItem {
  external_urls: ExternalURLs;
  type: "artist";
  uri: string;
  images: SpotifyImage[];
  genres: string[];
}

export interface SimpleTrack extends SimpleItem {
  type: "track";
  popularity: number;
  preview_url: string;
  artists: SimpleArtist[];
  images: SpotifyImage[];
  album: {
    name: string;
    id: string;
    href: string;
    images: SpotifyImage[];
    type: "album";
    uri: string;
    release_date: string;
    release_date_precision: ReleasePrecision;
    artist: SimpleArtist[];
    available_markets: string[];
  };
  track_number: number;
}

export interface NowPlaying {
  currently_playing_type: string;
  is_playing: boolean;
  progress_ms: number;
  timestamp: number;
  item: NowPlayingTrack;
  context: Context;
}

interface NowPlayingArtist {
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface NowPlayingTrack {
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIDs;
  external_urls: ExternalURLs;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  preview_url: string;
  track_number: number;
  type: "track";
  uri: string;
  popularity: number;
  artists: NowPlayingArtist[];
  album: NowPlayingAlbum;
}

interface NowPlayingAlbum {
  album_type: string;
  available_markets: string[];
  external_urls: ExternalURLs;
  href: string;
  id: string;
  name: string;
  release_date: string;
  release_date_precision: ReleasePrecision;
  total_tracks: number;
  type: "album";
  uri: string;
  images: SpotifyImage[];
  artists: SimpleArtist[];
}

export interface RelatedArtists {
  artists: SimpleArtist[];
}
