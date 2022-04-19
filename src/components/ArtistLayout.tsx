import { useArtist } from "../hooks";
import { Image } from "./Image";
import { Link } from "./Link";

export const ArtistLayout: React.FC<{ id: string }> = ({ id, children }) => {
  const { data: artist, error } = useArtist(id);
  if (!artist) return null;
  return (
    <div className="space-y-8 relative">
      <div className="primary-bg w-full rounded py-6 px-4 shadow">
        <div className="flex items-center gap-4 text-center md:text-left flex-wrap justify-center md:justify-start">
          <div className="img-wrapper is-rounded shadow h-[200px] w-[200px]">
            <Image
              src={artist.images[0]?.url}
              width={artist.images[0]?.width}
              height={artist.images[0]?.height}
              alt={artist.name}
            />
          </div>
          <div className="space-y-4">
            <section>
              <h1 className="text-2xl font-bold truncate">{artist.name}</h1>
              <div className="space-x-2 subtext">
                {new Intl.ListFormat("en").format(artist.genres)}
              </div>
            </section>
            <section className="flex flex-wrap gap-4 justify-center sm:justify-start">
              <Link href={artist.external_urls.spotify} className="button bg-hover">
                Open In Spotify
              </Link>
            </section>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
