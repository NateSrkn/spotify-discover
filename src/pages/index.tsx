import { Session } from "next-auth";
import { getSession } from "next-auth/client";
import { options as optionsAtom } from "../util/store";
import { GetServerSideProps } from "next";

import { useAtom } from "jotai";
import React, { useState } from "react";
import { toUppercase } from "../util/helpers";
import { useQueryClient, QueryClient, dehydrate } from "react-query";
import { useTopItems, prefetchArtist, useNowPlaying } from "../hooks";
import { Artist, Track, Select, Layout } from "../components";
import { getNowPlaying, getTopItems } from "../util/spotify";
interface HomeProps {
  session: Session;
}
export default function Home({ session }: HomeProps) {
  const queryClient = useQueryClient();
  const [options, setOptions] = useAtom(optionsAtom);
  const [activeArtist, setActiveArtist] = useState(null);
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
              <Artist
                key={item.id}
                baseArtist={item}
                onMouseEnter={() =>
                  setTimeout(() => prefetchArtist(queryClient, item.id), 500)
                }
                onClick={() => setActiveArtist(item.id)}
                isActive={isActive}
                handleClose={() => setActiveArtist(null)}
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
    () => getTopItems({ type: "artists", time_range: "short_term" }, session),
    queryConfig
  );
  await queryClient.prefetchQuery(
    ["tracks", "short_term"],
    () => getTopItems({ type: "tracks", time_range: "short_term" }, session),
    queryConfig
  );
  return {
    props: { session, dehydratedState: dehydrate(queryClient) },
  };
};
