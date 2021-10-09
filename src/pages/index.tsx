import Head from "next/head";
import Image from "next/image";
import { Session } from "next-auth";
import { getSession, signOut } from "next-auth/client";
import { getTopItems } from "../util/spotify";
import {
  options as optionsAtom,
  selectedArtist as selectedArtistAtom,
} from "../util/store";
import { SimplifiedTopItem } from "../util/types/spotify";
import { GetServerSideProps } from "next";
import { useNowPlaying, prefetchArtist } from "../util/query";
import NowPlaying from "../components/NowPlaying";
import { useAtom } from "jotai";
import React from "react";
import Artist from "../components/Artist";
import cx from "classnames";
import Track from "../components/Track";

interface HomeProps {
  session: Session;
  topItems: TopItems;
}
export default function Home({ session, topItems }: HomeProps) {
  const [options, setOptions] = useAtom(optionsAtom);
  const [selectedArtist, setSelectedArtist] = useAtom(selectedArtistAtom);
  const current_selection = topItems[options.type][options.termLength];
  const { data: nowPlaying } = useNowPlaying();

  const handleSelectArtist = async (id: string) => {
    const isSelected = selectedArtist?.artist?.id === id;
    if (isSelected) return;
    const expandedArtist = await prefetchArtist(id);
    setSelectedArtist(expandedArtist);
  };

  const types = {
    tracks: "Tracks",
    artists: "Artists",
  };

  const titles = {
    long_term: "All Time",
    medium_term: "Last 6 Months",
    short_term: "Last Month",
  };

  const handleSetOptions = (name: keyof typeof options, value: string) => {
    if (options[name] === value) return;
    setOptions({ ...options, [name]: value });
    setSelectedArtist({});
  };

  return (
    <div>
      <Head>
        <title>
          Discovery {nowPlaying.isListening ? `| ${nowPlaying.compact}` : ""}
        </title>
        <meta name="description" content="Spotify Discovery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col my-4">
        <div className="flex gap-4 items-center">
          <div
            className={cx("overflow-hidden h-16 w-16 rounded-full", {
              "bg-gray-200": !session.user.image,
            })}
          >
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={`Profile image for ${session.user.name}`}
                width={100}
                height={100}
                objectFit="cover"
              />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold">{session.user.name}</h3>
            <div
              className="text-xs cursor-pointer hover:underline"
              onClick={() => signOut()}
            >
              Sign out
            </div>
          </div>
        </div>
        <div className="my-4">
          <NowPlaying />
        </div>
      </div>

      <div>
        <div className="flex border-b border-green-custom pb-2 mb-4 items-baseline justify-between flex-wrap">
          <h3 className="text-xl font-medium">
            Top {types[options.type]} / {titles[options.termLength]}
          </h3>
          <div>
            {Object.entries(types).map(([key, value]) => (
              <button
                onClick={() => handleSetOptions("type", key)}
                key={key}
                className="font-normal dark:text-pewter-blue inline-block p-1 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-green-custom transition-all"
              >
                {value}
              </button>
            ))}
            {Object.entries(titles).map(([key, value]) => (
              <button
                onClick={() => handleSetOptions("termLength", key)}
                key={key}
                className="font-normal dark:text-pewter-blue inline-block p-1 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-green-custom  transition-all"
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <ul className="flex flex-col gap-4">
          {current_selection.map((item) =>
            options.type === "tracks" ? (
              <Track track={item} key={item.id} />
            ) : (
              <Artist
                key={item.id}
                artist={item}
                onClick={() => handleSelectArtist(item.id)}
                isActive={selectedArtist?.artist?.id === item.id}
                handleClose={() => setSelectedArtist({})}
                expandedArtist={selectedArtist}
              />
            )
          )}
        </ul>
      </div>
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
