import { SimplifiedTopItem } from "../util/types/spotify";
import Image from "next/image";
export default function Track({ track }: { track: SimplifiedTopItem }) {
  const hasImage = track.images.length > 0;
  return (
    <div className="w-full bg-green-custom  justify-self-start relative flex flex-col shadow-md rounded-sm bg-opacity-10 p-4">
      <div className="flex flex-row items-center gap-4">
        <div className="md:w-36 md:h-36 w-20 h-20 shadow-md flex-shrink-0">
          {hasImage ? (
            <Image
              src={track.images[0].url}
              height={track.images[0].height}
              width={track.images[0].width}
              alt={`Image of ${track.name}`}
              objectFit="cover"
            />
          ) : (
            <div className="bg-gray-200 h-full w-full"></div>
          )}
        </div>
        <div className="truncate">
          <h3 className="truncate text-md font-medium">{track.name}</h3>
          <div className="text-sm subtext">{track.artists.string}</div>
        </div>
      </div>
    </div>
  );
}
