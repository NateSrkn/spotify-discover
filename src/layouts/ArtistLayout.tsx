import { Image, Link, ILink } from "../components";
import { useRouter } from "next/router";

import cx from "classnames";
import useSWRImmutable from "swr/immutable";

import { fetcher } from "../util/api";
import { useWindowSize } from "../hooks/useWindowSize";
import { requests } from "../util/helpers";
import { useArtist } from "../hooks";
import { useRelatedArtists } from "../hooks/useRelatedArtists";

export const ArtistLayout: React.FC = ({ children }) => {
  const router = useRouter();
  const key = "artist";
  const artist = router.query[key] || router.asPath.match(new RegExp(`[&?]${key}=(.*)(&|$)`));
  const id = artist && artist[0];
  const { data } = useArtist(id);
  const windowSize = useWindowSize();
  const isDisplayMobile = windowSize.width < 768;
  const { data: related_artists } = useRelatedArtists(id, id && !isDisplayMobile);
  if (!data) return <div>Loading...</div>;
  return (
    <div className="space-y-8 relative">
      <div className="dark:bg-primary-green bg-slate-200 w-full rounded py-6 px-4 shadow">
        <div className="flex items-center gap-4 text-center md:text-left flex-wrap justify-center md:justify-start">
          <div className="img-wrapper is-rounded shadow h-[200px] w-[200px]">
            <Image
              src={data.images[0]?.url}
              width={data.images[0]?.width}
              height={data.images[0]?.height}
              alt={data.name}
            />
          </div>
          <div className="space-y-4">
            <section>
              <h1 className="text-2xl font-bold truncate">{data.name}</h1>
              <div className="space-x-2 subtext">
                {new Intl.ListFormat("en").format(data.genres)}
              </div>
            </section>
            <section className="flex flex-wrap gap-4 justify-center">
              {/* <Button action={() => {}}>Add To Playlist</Button>
              <Button action={() => {}}>Add To Playlist</Button>
              <Button action={() => {}}>Add To Playlist</Button> */}
            </section>
          </div>
        </div>
      </div>
      <section className="grid grid-cols-6 gap-8 sm:gap-12">
        <div className="col-span-6 md:col-span-4 space-y-4">
          <div className="flex space-x-4 border-b dark:border-secondary-green border-slate-200 overflow-y-hidden overflow-x-auto scrollbar-none">
            <ActiveLink href={`/artist/${data.id}/top-tracks`}>Top Tracks</ActiveLink>
            <ActiveLink
              href={`/artist/${data.id}/albums?include_groups=album`}
              swrKey={requests["artist_extended"](data.id, "albums", `&include_groups=album`)}
            >
              Albums
            </ActiveLink>
            <ActiveLink
              href={`/artist/${data.id}/albums?include_groups=single`}
              swrKey={requests["artist_extended"](data.id, "albums", `&include_groups=single`)}
            >
              Singles
            </ActiveLink>
            <ActiveLink
              href={`/artist/${data.id}/albums?include_groups=appears_on`}
              swrKey={requests["artist_extended"](data.id, "albums", `&include_groups=appears_on`)}
            >
              Features
            </ActiveLink>
            {isDisplayMobile && (
              <ActiveLink href={`/artist/${data.id}/related-artists`}>Related Artists</ActiveLink>
            )}
          </div>
          <div>{children}</div>
        </div>
        {!isDisplayMobile && related_artists ? (
          <div className="col-span-2 space-y-4">
            <div className="border-b dark:border-secondary-green border-slate-200">
              <div className="tab">Related Artists</div>
            </div>
            <RelatedArtistsList artists={related_artists.artists} />
          </div>
        ) : null}
      </section>
    </div>
  );
};
