import { SpotifyImage } from "../util/types/spotify";
import { Image } from "./Image";
export const ListCard: React.FC<{
  image?: SpotifyImage;
  title: string;
  subtitle: string;
}> = ({ image, title, subtitle }) => {
  return (
    <div className="flex items-center rounded overflow-hidden border border-slate-200 dark:border-primary-green gap-4 relative dark:hover:bg-primary-green hover:bg-slate-200 hover:scale-105 transition-all">
      <div className="flex-shrink-0 p-2 dark:bg-primary-green bg-slate-200 max-w-[100px] max-h-[100px] sm:max-w-[125px] sm:max-h-[125px]">
        <Image
          src={image.url}
          height={image.height}
          width={image.width}
          alt={title}
          className="rounded-full shadow-lg"
        />
      </div>
      <div className="pr-2 flex-grow-0 truncate">
        <div className="font-bold truncate">{title}</div>
        <div className="subtext truncate">{subtitle}</div>
      </div>
    </div>
  );
};
