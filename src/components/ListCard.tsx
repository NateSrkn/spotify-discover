import { Image } from "./Image";
import cx from "classnames";

export const ListCard: React.FC<{
  image?: string;
  title: string;
  subtitle: React.ReactNode;
  type: "artist" | "track";
}> = ({ image, title, subtitle, type }) => {
  return (
    <div className="flex items-center rounded-2xl overflow-hidden  relative bg-primary-green hover:bg-primary-green/50 transition-all group">
      <div
        className="flex-shrink-0  w-[100px] sm:w-[125px] h-full "
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <div className="backdrop-blur bg-white/30 w-full h-full flex items-center justify-center p-2">
          <Image
            src={image}
            height={500}
            width={500}
            alt={title}
            className={cx("shadow-lg aspect-square object-cover ", {
              "rounded-full": type === "artist",
              "rounded-xl": type === "track",
            })}
          />
        </div>
      </div>
      <div className="pr-2 flex-grow-0 truncate p-4">
        <div className="font-bold truncate">{title}</div>
        <div className="text-sm text-pewter-blue truncate">{subtitle}</div>
      </div>
    </div>
  );
};
