import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { toUppercase } from "../util/helpers";
import { QueryClient, dehydrate, InfiniteQueryObserverOptions } from "react-query";
import { useNowPlaying, useInfiniteTopItems, useMultiRef } from "../hooks";
import { Track, Select, Layout, Button } from "../components";
import { getNowPlaying, getTopItems } from "../util/spotify";
import { ExpandableCard } from "../components/ExpandableCard";
import { Options } from "../util/types/spotify";

export default function Home() {
  const [options, setOptions] = useState<Options>({
    type: "artists",
    termLength: "short_term",
  });
  const [activeArtist, setActiveArtist] = useState<string>(null);
  const [setRef, getRef] = useMultiRef();

  const scrollToArtist = (id) => {
    const artist = getRef(id);
    if (artist) {
      setTimeout(() => artist.scrollIntoView({ behavior: "smooth" }), 200);
    }
  };

  const {
    data: current_selection,
    isLoading,
    isFetched,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteTopItems(options.type, options.termLength);
  const { data: nowPlaying } = useNowPlaying();
  const types = ["tracks", "artists"];
  const titles = {
    long_term: "All Time",
    medium_term: "Last 6 Months",
    short_term: "Last Month",
  };

  const handleSetOptions = (name: keyof typeof options, value: string) => {
    if (options[name] === value) return;
    setOptions({ ...options, [name]: value });
    setActiveArtist(null);
  };

  return (
    <Layout
      title={`${toUppercase(types.find((type) => type === options.type))} ${
        nowPlaying.isListening ? `| ${nowPlaying.compact}` : ""
      }`}
    >
      <div className="flex items-baseline flex-wrap gap-2">
        <Select
          options={types.map((value) => ({
            value,
            label: `Top ${toUppercase(value)}`,
          }))}
          defaultValue={{
            value: options.type,
            label: `Top ${toUppercase(options.type)}`,
          }}
          ariaLabel="Select top artists or tracks"
          onChange={(value) => handleSetOptions("type", value)}
        />
        <Select
          options={Object.entries(titles).map(([value, label]) => ({
            value,
            label,
          }))}
          defaultValue={{
            label: titles[options.termLength],
            value: options.termLength,
          }}
          ariaLabel={`Select time frame`}
          onChange={(value) => handleSetOptions("termLength", value)}
        />
      </div>
      <hr className="w-full border-1 border-green-custom mt-4 mb-4" />

      <ul className="flex flex-col gap-4">
        {isLoading && <p>Loading...</p>}
        {isFetched &&
          current_selection.pages.map((page) =>
            page.items.map((item, index) => {
              if (item.type === "track") {
                return <Track track={item} key={item.id} />;
              }

              const isActive = item.id === activeArtist;
              return (
                <li key={item.id} ref={(node) => setRef(node, item.id)}>
                  <ExpandableCard
                    baseData={item}
                    isOpen={isActive}
                    onClick={(id) => {
                      setActiveArtist(id);
                      scrollToArtist(id);
                    }}
                    handleScrollTo={() => scrollToArtist(item.id)}
                  />
                </li>
              );
            })
          )}
      </ul>
      {hasNextPage && (
        <Button
          action={fetchNextPage}
          style={{
            marginTop: "1.25rem",
          }}
        >
          See More
        </Button>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "login",
        permanent: false,
      },
    };
  }
  const queryClient = new QueryClient();
  const queryConfig: InfiniteQueryObserverOptions = {
    staleTime: Infinity,
    cacheTime: Infinity,
    getNextPageParam: ({ next }) => next,
  };
  await queryClient.prefetchQuery("nowPlaying", () => getNowPlaying(session));
  await queryClient.prefetchInfiniteQuery(
    ["artists", "short_term"],
    () => getTopItems({ type: "artists", time_range: "short_term" }, session),
    queryConfig
  );

  return {
    props: { session, dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))) },
  };
};
