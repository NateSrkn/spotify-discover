import Head from "next/head";
import Image from "../components/Image";
import { Session } from "next-auth";
import { getSession, signOut } from "next-auth/client";
import { getTopItems } from "../util/spotify";
import { options as optionsAtom } from "../util/store";
import { SimplifiedTopItem } from "../util/types/spotify";
import { GetServerSideProps } from "next";
import {
  useNowPlaying,
  prefetchArtist,
  useArtist,
  checkForData,
} from "../util/query";
import NowPlaying from "../components/NowPlaying";
import { useAtom } from "jotai";
import React, { useState } from "react";
import Artist from "../components/Artist";
import Track from "../components/Track";
import Button from "../components/Button";
import Select from "../components/Select";
import { toUppercase } from "../util/helpers";

interface HomeProps {
  session: Session;
  topItems: TopItems;
}
export default function Home({ session, topItems }: HomeProps) {
  const [options, setOptions] = useAtom(optionsAtom);
  const [activeArtist, setActiveArtist] = useState(null);
  const current_selection = topItems[options.type][options.termLength];
  const { data: nowPlaying } = useNowPlaying();
  const artistQuery = useArtist(activeArtist);

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
    <div>
      <Head>
        <title>
          {toUppercase(types.find((type) => type === options.type))}{" "}
          {nowPlaying.isListening ? `| ${nowPlaying.compact}` : ""}
        </title>
        <meta name="description" content="Spotify Discovery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col my-4">
        <div className="flex gap-4 items-center">
          <div className="overflow-hidden h-16 w-16 rounded-full">
            <Image
              src={session.user.image}
              alt={session.user.name}
              width={100}
              height={100}
            />
          </div>
          <div>
            <h3 className="text-xl font-bold">{session.user.name}</h3>
            <Button onClick={() => signOut()}>
              <span className="text-xs">Sign Out</span>
            </Button>
          </div>
        </div>
        <div className="my-4">
          <NowPlaying />
        </div>
      </div>
      <div className="flex border-b border-green-custom pb-2 mb-4 items-baseline flex-wrap gap-2">
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
      <ul className="flex flex-col gap-4">
        {current_selection.map((item) => {
          if (item.type === "track") {
            return <Track track={item} key={item.id} />;
          }
          const isActive =
            !artistQuery.isLoading &&
            checkForData(["artist", item.id]) &&
            item.id === activeArtist;
          return (
            <Artist
              key={item.id}
              data={isActive ? artistQuery.data : { artist: item }}
              onMouseEnter={async () => await prefetchArtist(item.id)}
              onClick={() => setActiveArtist(item.id)}
              isActive={isActive}
              handleClose={() => setActiveArtist(null)}
            />
          );
        })}
      </ul>
    </div>
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
  const types: TypesList = ["artists", "tracks"];
  const termLengths: TermLengths = ["short_term", "medium_term", "long_term"];
  const topItems = {};
  for (let i = 0; i < types.length; i++) {
    const type = types[i];
    topItems[type] = {};
    for (let j = 0; j < termLengths.length; j++) {
      const time_range = termLengths[j];
      const data = await getTopItems({ type, time_range }, session);
      topItems[type][time_range] = data.items;
    }
  }
  return {
    props: { session, topItems },
  };
};

export type TermLengths = ["short_term", "medium_term", "long_term"];
export type TypesList = ["artists", "tracks"];
type TopItems = {
  artists?: {
    [key in TermLengths[number]]?: SimplifiedTopItem[];
  };
  tracks?: {
    [key in TermLengths[number]]?: SimplifiedTopItem[];
  };
};
