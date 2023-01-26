import { Image } from "./Image";
export const ListCard: React.FC<{
  image?: string;
  title: string;
  subtitle: string | React.ReactNode;
}> = ({ image, title, subtitle }) => {
  return (
    <div className="flex items-center justify-between rounded overflow-hidden border border-primary-green gap-4 relative bg-primary-green transition-all group">
      <div className="pr-2 flex-grow-0 truncate p-4">
        <div className="font-bold truncate">{title}</div>
        <div className="subtext truncate">{subtitle}</div>
      </div>
      <div className="flex-shrink-0 p-2  w-[100px] sm:w-[125px] h-full group-hover:scale-105 transition-transform">
        <Image
          src={image}
          height={500}
          width={500}
          alt={title}
          className="rounded shadow-lg aspect-square object-cover"
        />
      </div>
    </div>
  );
};

export const SkeletonListCard = () => {
  return (
    <div className="flex items-center rounded overflow-hidden border primary-border gap-4 relative">
      <div className="p-4 w-full space-y-2">
        <div className="h-6 skeleton-text"></div>
        <div className="h-5 skeleton-text"></div>
      </div>
      <div className="flex-shrink-0 p-2 w-[100px] sm:w-[125px] h-full animate-pulse">
        <Image
          src={undefined}
          height={100}
          width={100}
          alt={""}
          className="rounded shadow-lg w-full"
        />
      </div>
    </div>
  );
};
