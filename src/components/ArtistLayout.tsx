import { useArtist } from "../hooks";
import { Image } from "./Image";
import { Link } from "./Link";

export const ArtistLayout: React.FC<{ id: string }> = ({ id, children }) => {
  const { data: artist } = useArtist(id);
  if (!artist) return <SkeletonArtistLayout>{children}</SkeletonArtistLayout>;
  return (
    <div className="space-y-8 relative">
      <div className="primary-bg w-full rounded py-6 px-4 shadow">
        <div className="flex items-center gap-4 text-center md:text-left flex-wrap justify-center md:justify-start">
          <div className="img-wrap full-round lg-img">
            <Image
              src={artist.images[0]?.url}
              width={200}
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

export const SkeletonArtistLayout = ({ children }) => {
  return (
    <div className="space-y-8 relative">
      <div className="primary-bg w-full rounded py-6 px-4 shadow">
        <div className="flex items-center gap-4 text-center md:text-left flex-wrap justify-center md:justify-start">
          <div className="img-wrap full-round lg-img animate-pulse">
            <Image src={undefined} width={200} height={200} alt={""} />
          </div>
          <div className="space-y-4 w-full max-w-sm">
            <section className="w-full space-y-2">
              <div className="skeleton-text h-8" />
              <div className="skeleton-text h-5" />
            </section>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
