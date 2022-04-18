import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import React from "react";
import invariant from "tiny-invariant";
import { ExpandableList, ILink, Layout, Link, MiniTrack } from "../../components";
import { fetcher, spotify } from "../../util/api";
import { Image } from "../../components";
import { TopTracks } from "../../components/TopTracks";
import { requests } from "../../util/helpers";
import { useRouter } from "next/router";
import classNames from "classnames";
import { getBaseArtist } from "../api/artist/[id]";
import { useWindowSize } from "../../hooks/useWindowSize";
import { getAlbum } from "../api/album/[id]";
import { getRelatedArtists } from "../api/artist/related-artists";

const ArtistPage = (props) => {
  const { artist } = props;
  const router = useRouter();
  const { query } = router;
  const { include_groups = "" } = query;
  const windowSize = useWindowSize();
  const isDisplayMobile = windowSize.width < 768;

  const tabs = [
    {
      label: "Top Tracks",
      href: `/artist/${props.artist.id}/top-tracks`,
      value: "top-tracks",
      swrKey: requests["artist_extended"](artist.id, "top-tracks"),
    },
    {
      label: "Albums",
      href: `/artist/${artist.id}/albums?include_groups=album`,
      value: "albums",
      swrKey: requests["artist_extended"](artist.id, "albums", `&include_groups=album`),
    },
    {
      label: "Singles",
      href: `/artist/${artist.id}/albums?include_groups=single`,
      value: "albums",
      swrKey: requests["artist_extended"](artist.id, "albums", `&include_groups=single`),
    },
    {
      label: "Features",
      href: `/artist/${artist.id}/albums?include_groups=appears_on`,
      value: "albums",
      swrKey: requests["artist_extended"](artist.id, "albums", `&include_groups=appears_on`),
    },
  ];
  const TabLink: React.FC<ILink> = ({ children, href }) => {
    const isActive = href === router.asPath || router.asPath.startsWith(`${href}/`);
    return (
      <Link
        href={href}
        className={classNames("tab", {
          active: isActive,
        })}
        scroll={false}
      >
        {children}
      </Link>
    );
  };

  const RelatedArtistsList = ({ artists }) => {
    return (
      <ExpandableList className="space-y-1" startingLength={artists.length / 2}>
        {artists.map((artist) => (
          <li key={artist.id}>
            <Link
              href={`/artist/${artist.id}/top-tracks`}
              className="flex items-center space-x-4 bg-hover p-1 rounded"
            >
              <div className="img-wrapper max-w-[40px]">
                <Image
                  src={artist.images[0].url}
                  width={50}
                  height={50}
                  alt={artist.name}
                  className="shadow rounded-full"
                />
              </div>
              <h3 className="truncate py-1 text-sm">{artist.name}</h3>
            </Link>
          </li>
        ))}
      </ExpandableList>
    );
  };

  const AlbumList = ({ albums }) => {
    if (!albums) return null;
    return (
      <>
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/artist/${artist.id}/albums/${album.id}?include_groups=${include_groups}`}
            className="space-y-2"
          >
            <div className="img-wrapper">
              <Image
                src={album.images[1]?.url}
                height={album.images[1]?.height}
                width={album.images[1]?.width}
                alt={album.name}
                className="rounded shadow"
              />
            </div>
            <h3 className="truncate py-1 text-sm">{album.name}</h3>
          </Link>
        ))}
      </>
    );
  };

  return (
    <Layout>
      <div className="space-y-8 relative">
        <div className="dark:bg-primary-green bg-slate-200 w-full rounded py-6 px-4 shadow">
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
        <section className="grid grid-cols-6 gap-8 sm:gap-12">
          <div className="col-span-6 md:col-span-4 space-y-4">
            <div className="flex space-x-4 border-b dark:border-secondary-green border-slate-200 overflow-y-hidden overflow-x-auto scrollbar-none">
              {tabs.map((tab) => (
                <TabLink href={tab.href} key={tab.href}>
                  {tab.label}
                </TabLink>
              ))}
              {isDisplayMobile && (
                <TabLink href={`/artist/${artist.id}/related-artists`}>Related Artists</TabLink>
              )}
            </div>
            {props["top-tracks"] && <TopTracks tracks={props["top-tracks"].tracks} />}
            {props.albums && (
              <>
                {props.album && (
                  <div className="dark:bg-primary-green bg-slate-200 rounded shadow p-4 ">
                    <section className="flex flex-wrap gap-4 items-center">
                      <div className="img-wrapper w-full sm:max-w-[140px] rounded shadow overflow-hidden">
                        <Image
                          src={props.album.images[0]?.url}
                          width={props.album.images[0]?.width}
                          height={props.album.images[0]?.height}
                          alt={props.album.name}
                        />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="subtext text-xs">Album</span>
                          <h4>{props.album.name}</h4>
                        </div>
                        <div>
                          <div className="subtext text-xs">Release Date</div>
                          <span className="text-xs">{formatDate(props.album.release_date)}</span>
                        </div>
                        <div>
                          <Link
                            className="subtext text-xs hover:underline"
                            href={props.album.external_urls.spotify}
                          >
                            Open In Spotify
                          </Link>
                        </div>
                      </div>
                      <ul className="grid w-full">
                        {props.album.tracks.items.map((track) => (
                          <li key={track.id} className="truncate">
                            <MiniTrack track={track} hasImage={false} isNumbered />
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                )}
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
                  <AlbumList albums={props.albums.items} />
                </div>
              </>
            )}
            {router.asPath.includes("/related-artists") &&
              props.related_artists &&
              isDisplayMobile && <RelatedArtistsList artists={props.related_artists.artists} />}
          </div>
          {!isDisplayMobile && props.related_artists ? (
            <div className="col-span-2 space-y-4">
              <div className="border-b dark:border-secondary-green border-slate-200">
                <div className="tab">Related Artists</div>
              </div>
              <RelatedArtistsList artists={props.related_artists.artists} />
            </div>
          ) : null}
        </section>
      </div>
    </Layout>
  );
};

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${month}/${day}/${year}`;
};

export default ArtistPage;
export const getServerSideProps: GetServerSideProps = async ({ req, query, res }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  invariant(query.artist, "No artist id provided");
  invariant(Array.isArray(query.artist), "No Path provided");
  const { artist: artistParams, ...rest } = query;
  const [id, path = "top-tracks", albumId] = artistParams;
  const isAcceptedPath = ["top-tracks", "albums", "related-artists"].includes(path);

  if (!isAcceptedPath) {
    return {
      notFound: true,
    };
  }
  const [artist, data, album, related_artists] = await Promise.all([
    getBaseArtist(id, session),
    fetcher(
      {
        url: `/artists/${id}/${path}`,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Cache-Control": "s-maxage=3600, stale-while-revalidate",
        },
        params: {
          market: session.user.country,
          ...rest,
        },
      },
      spotify
    ),
    getAlbum(albumId, session),
    getRelatedArtists(id, session),
  ]);
  res.setHeader("Cache-Control", "s-maxage=3600");
  return {
    props: {
      artist,
      [path]: data,
      album: albumId ? album : null,
      related_artists,
    },
  };
};
