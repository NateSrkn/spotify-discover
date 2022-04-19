import { useAudio } from "../providers";
import { Track } from "./Track";

export const TopTracks = ({ tracks }) => {
  const { updateAudio } = useAudio();
  return (
    <section className="space-y-1 grid grid-col-1 sm:grid-cols-2">
      {tracks.map((track) => (
        <button
          key={track.id}
          onClick={() => updateAudio(track)}
          className="w-full bg-hover p-1 cursor-pointer rounded flex truncate justify-center items-center"
        >
          <Track track={track} hasImage />
        </button>
      ))}
    </section>
  );
};
