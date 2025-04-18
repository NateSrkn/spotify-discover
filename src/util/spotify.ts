import { Artist, Track } from "@spotify/web-api-ts-sdk";

export const assertTrack = (item: Track | Artist): item is Track => {
  return (item as Track).disc_number !== undefined;
};
