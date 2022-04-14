import React from "react";
import { ExpandableList, MiniTrack } from ".";
import { Album, SimpleTrack, Track } from "../util/types/spotify";

export const TrackList = ({
  tracks,
  album = null,
  title = "",
  length = 5,
}: {
  tracks: Track[] | SimpleTrack[];
  album?: Album;
  title?: string;
  length?: number;
}) => {
  const isAlbum = album !== null;
  return (
    <ExpandableList title={title} startingLength={length}>
      {tracks.map((track) => (
        <MiniTrack track={track} hasImage={!isAlbum} isNumbered={isAlbum} key={track.id} />
      ))}
    </ExpandableList>
  );
};
