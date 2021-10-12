import { SimplifiedTopItem } from "../util/types/spotify";
import { Image } from ".";
export const Track = ({ track }: { track: SimplifiedTopItem }) => {
  return (
    <div className="w-full bg-green-custom  justify-self-start relative flex flex-col shadow-md rounded-md bg-opacity-10 p-5">
      <div className="flex flex-row items-center gap-4">
        <div className="md:w-28 md:h-28 w-20 h-20 shadow-md flex-shrink-0">
          <Image
            src={track.images[0]?.url}
            height={track.images[0]?.height}
            width={track.images[0]?.width}
            alt={track.name}
          />
        </div>
        <div className="truncate">
          <h3 className="truncate text-md font-medium">{track.name}</h3>
          <div className="truncate text-sm subtext">{track.artists.string}</div>
        </div>
      </div>
    </div>
  );
};
