import { Album } from "../util/types/spotify";
import { ExpandableList, Image } from ".";

export const AlbumList = ({
  albums,
  title = "",
  onClick,
}: {
  albums: Album[];
  title?: string;
  onClick: (album: Album) => void;
}) => {
  if (!albums || !albums.length) return null;
  return (
    <ExpandableList
      title={title}
      startingLength={title ? 5 : albums.length}
      className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5"
    >
      {albums.map(({ images, ...album }) => (
        <div
          key={album.id}
          className="truncate cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-green-custom rounded-sm"
          onClick={() => onClick({ images, ...album })}
          title={album.name}
        >
          <div className="img-wrapper">
            <Image
              src={images[1]?.url}
              height={images[1]?.height}
              width={images[1]?.width}
              alt={album.name}
            />
          </div>
          <h3 className="truncate py-1 text-sm">{album.name}</h3>
        </div>
      ))}
    </ExpandableList>
  );
};
