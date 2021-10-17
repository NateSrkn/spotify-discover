import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import { GetServerSideProps } from "next";
import React, { useState } from "react";
import { toUppercase } from "../util/helpers";
import { QueryClient, dehydrate } from "react-query";
import { useTopItems, useNowPlaying } from "../hooks";
import { Track, Select, Layout } from "../components";
import { getNowPlaying, getTopItems } from "../util/spotify";
import { ExpandableCard } from "../components/ExpandableCard";
import { Options } from "../util/types/spotify";

interface HomeProps {
  session: Session;
}
export default function Home({ session }: HomeProps) {
  const [options, setOptions] = useState<Options>({
    type: "artists",
    termLength: "short_term",
  });
  const [activeArtist, setActiveArtist] = useState<string>(null);
  const { data: current_selection, isFetched } = useTopItems(
    options.type,
    options.termLength
  );
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
      session={session}
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
          onClick={(value) => handleSetOptions("type", value)}
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
          onClick={(value) => handleSetOptions("termLength", value)}
        />
      </div>
      <hr className="w-full border-1 border-green-custom mt-2 mb-4" />
      <ul className="flex flex-col gap-4">
        {isFetched &&
          current_selection.items.map((item) => {
            if (item.type === "track") {
              return <Track track={item} key={item.id} />;
            }
            const isActive = item.id === activeArtist;
            return (
              <ExpandableCard
                key={item.id}
                baseData={item}
                isOpen={isActive}
                onClick={(id) => setActiveArtist(id)}
              />
            );
          })}
      </ul>
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
  const queryConfig = {
    staleTime: Infinity,
    cacheTime: Infinity,
  };
  await queryClient.prefetchQuery("nowPlaying", () => getNowPlaying(session));
  await queryClient.prefetchQuery(
    ["artists", "short_term"],
    () => getTopItems({ type: "artists", termLength: "short_term" }, session),
    queryConfig
  );
  await queryClient.prefetchQuery(
    ["tracks", "short_term"],
    () => getTopItems({ type: "tracks", termLength: "short_term" }, session),
    queryConfig
  );
  return {
    props: { session, dehydratedState: dehydrate(queryClient) },
  };
};
