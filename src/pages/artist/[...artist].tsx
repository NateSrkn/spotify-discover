import classNames from "classnames";
import { GetServerSideProps, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef } from "react";
import { ExpandableList, Image, Layout, Link, TabLink } from "../../components";
import { Album } from "../../components/Album";
import { ArtistLayout } from "../../components/ArtistLayout";
import { TopTracks } from "../../components/TopTracks";
import { useAlbum } from "../../hooks";
import { fetcher, spotify } from "../../util/api";
import { requests } from "../../util/helpers";
import { getRelatedArtists } from "../api/artist/related-artists";

const ArtistPage: NextPage<{
  id: string;
  type: string;
  query: string;
  top_tracks?: any;
  albums?: any;
  related_artists: any;
}> = (props) => {
  const router = useRouter();
  const { data, status } = useSession();
  const { include_groups = "", album: albumId = undefined } = router.query;
  const { data: album } = useAlbum(albumId as string);
  const { current: tabs } = useRef([
    {
      label: "Top Tracks",
      href: `/artist/${props.id}/top-tracks`,
      value: "top-tracks",
    },
    {
      label: "Albums",
      href: `/artist/${props.id}/albums?include_groups=album`,
      value: "albums",
    },
    {
      label: "Singles",
      href: `/artist/${props.id}/albums?include_groups=single`,
      value: "albums",
    },
    {
      label: "Features",
      href: `/artist/${props.id}/albums?include_groups=appears_on`,
      value: "albums",
    },
  ]);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);
  const AlbumList = ({ albums }) => {
    if (!albums) return null;
    return (
      <Fragment>
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/artist/${props.id}/albums?include_groups=${include_groups}&album=${album.id}`}
            className="space-y-2"
            shallow={true}
          >
            <div className="img-wrap soft-round">
              <Image
                src={album.images[1]?.url}
                height={album.images[1]?.height}
                width={album.images[1]?.width}
                alt={album.name}
              />
            </div>
            <h3 className="truncate py-1 text-sm">{album.name}</h3>
          </Link>
        ))}
      </Fragment>
    );
  };

  const RelatedArtistsList = ({ artists }) => {
    return (
      <ExpandableList className="space-y-1" startingLength={artists.length / 2}>
        {artists.map((artist) => (
          <li key={artist.id}>
            <Link
              href={`/artist/${artist.id}/top-tracks`}
              swrKey={requests["artist"](artist.id)}
              className="flex items-center space-x-4 bg-hover p-1 rounded"
            >
              <div className="img-wrap max-w-[40px] max-h-[40px] flex-grow shadow rounded-full overflow-hidden">
                <Image src={artist.images[0]?.url} width={50} height={50} alt={artist.name} />
              </div>
              <h3 className="truncate py-1 text-sm">{artist.name}</h3>
            </Link>
          </li>
        ))}
      </ExpandableList>
    );
  };

  return (
    <Layout>
      <ArtistLayout id={props.id}>
        <section className="grid grid-cols-6 gap-8">
          <div className="col-span-6 md:col-span-4 space-y-4">
            <div className="flex space-x-4 border-b dark:border-secondary-green border-slate-200 overflow-y-hidden overflow-x-auto scrollbar-none">
              {tabs.map((tab) => (
                <TabLink href={tab.href} key={tab.href}>
                  {tab.label}
                </TabLink>
              ))}
              <TabLink href={`/artist/${props.id}/related-artists`} className="block md:hidden">
                Related Artists
              </TabLink>
            </div>
            {props.top_tracks && <TopTracks tracks={props.top_tracks.tracks} />}
            {props.albums && (
              <Fragment>
                {album && albumId && <Album album={album} />}
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5">
                  <AlbumList albums={props.albums.items} />
                </div>
              </Fragment>
            )}
            {props.type === "related-artists" && (
              <RelatedArtistsList artists={props.related_artists.artists} />
            )}
          </div>
          {props.type !== "related-artists" ? (
            <div className="col-span-2 space-y-4 hidden md:block">
              <div className="border-b dark:border-secondary-green border-slate-200">
                <div className="tab">Related Artists</div>
              </div>
              <RelatedArtistsList artists={props.related_artists.artists} />
            </div>
          ) : null}
        </section>
      </ArtistLayout>
    </Layout>
  );
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
  const { artist, ...params } = query;
  const [id, type] = typeof artist === "string" ? [artist, "top-tracks"] : artist;
  const isAcceptedPath = ["top-tracks", "albums", "related-artists"].includes(type);
  if (!isAcceptedPath) {
    return {
      notFound: true,
    };
  }
  const { include_groups = "" } = params;
  const requestParams: { [key: string]: string | string[] } = {
    market: session.user.country,
  };
  if (include_groups) {
    requestParams.include_groups = include_groups;
  }
  const [data, related_artists] = await Promise.all([
    type !== "related-artists"
      ? fetcher(
          {
            url: `/artists/${id}/${type}`,
            headers: { Authorization: `Bearer ${session.access_token}` },
            params: requestParams,
          },
          spotify
        )
      : {},
    getRelatedArtists(id, session),
  ]);
  const key = type !== "related_artists" ? type.split("-").join("_") : "ignore";
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  return {
    props: {
      id,
      type,
      [key]: data,
      related_artists,
    },
  };
};
