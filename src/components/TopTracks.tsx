import { MiniTrack } from "./Track";

export const TopTracks = ({ tracks }) => {
  return (
    <section className="space-y-1 grid grid-col-1 sm:grid-cols-2">
      {tracks.map((track) => (
        <MiniTrack key={track.id} track={track} />
      ))}
    </section>
  );
};
