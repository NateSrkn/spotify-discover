import { MiniTrack } from "./Track";

export const TopTracks = ({ tracks }) => {
  return (
    <section className="grid grid-col-1 sm:grid-cols-2 space-y-1">
      {tracks.map((track) => (
        <MiniTrack key={track.id} track={track} />
      ))}
    </section>
  );
};
