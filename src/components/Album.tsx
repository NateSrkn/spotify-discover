import classNames from "classnames";
import { useAudio } from "../providers";
import { Image } from "./Image";
import { Link } from "./Link";
import { Track } from "./Track";

export const Album = ({ album }) => {
  const { updateAudio } = useAudio();
  let rowCount = Math.floor(album.total_tracks / 2);
  if (album.total_tracks % 2) rowCount++;
  if (!album) return null;
  return (
    <div className="col-span-full mb-4 primary-bg rounded shadow p-4 space-y-4">
      <div className="flex gap-4 justify-center items-center flex-wrap md:flex-nowrap w-full text-center sm:text-left">
        <div className="img-wrapper rounded shadow h-[200px] w-[200px] overflow-hidden">
          <Image
            src={album.images[0].url}
            width={album.images[0].width}
            height={album.images[0].height}
            alt={album.name}
          />
        </div>
        <div className="flex flex-col w-full truncate">
          <h4 className="truncate">{album.name}</h4>
          <div className="subtext text-sm truncate">
            {album.artists.map((artist, index) => (
              <span key={artist.id}>
                <Link href={`/artist/${artist.id}/top-tracks`} className="hover:underline truncate">
                  {artist.name}
                </Link>
                <span className="truncate">{index < album.artists.length - 1 ? ", " : ""}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 md:grid-flow-col truncate gap-x-4`}
        style={{
          gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
        }}
      >
        {album.tracks?.items?.map((track) => (
          <button
            key={track.id}
            className={classNames(
              "flex w-full truncate p-1 bg-reverse-hover rounded items-center space-x-4 text-left",
              {
                "col-span-full": album.total_tracks < 2,
              }
            )}
            onClick={() => updateAudio(track)}
          >
            <div className="text-xs subtext font-mono tabular-nums min-w-[16px] inline-block text-right">
              <span>{track.track_number}</span>
            </div>
            <Track track={track} />
          </button>
        ))}
      </div>
    </div>
  );
};