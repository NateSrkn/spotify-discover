import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState } from "react";
import { toUppercase } from "../util/helpers";
import { useNowPlaying } from "../hooks";
import { Select, Layout, SelectOption } from "../components";
import { Options, TermLengths, TypesList } from "../util/types/spotify";
import { Link } from "../components/Link";
import { ListCard } from "../components/ListCard";
import { AudioContext } from "../providers";
import { useRouter } from "next/router";
import { fetcher, spotify } from "../util/api";

export default function Dashboard({
  type = TypesList.ARTISTS,
  time_range = TermLengths.SHORT_TERM,
  data,
}) {
  const { updateAudio } = useContext(AudioContext);
  const [options, setOptions] = useState<Options>({
    type,
    time_range,
  });
  const { data: now_playing } = useNowPlaying();
  const router = useRouter();
  const types = ["tracks", "artists"];
  const titles = {
    long_term: "All Time",
    medium_term: "Last 6 Months",
    short_term: "Last Month",
  };
  useEffect(() => {
    setOptions({ ...options, ...router.query });
  }, [router.query]);

  const handleSetOptions = (name: keyof typeof options, value: string) => {
    if (options[name] === value) return;
    setOptions({ ...options, [name]: value });
    router.push({ query: { ...options, [name]: value } });
  };

  return (
    <Layout
      title={`${toUppercase(options.type)} ${
        now_playing?.item
          ? `| ${now_playing.item.name} - ${now_playing.item.artists
              .map(({ name }) => name)
              .join(", ")}`
          : ""
      }`}
    >
      <div className="flex items-baseline flex-wrap space-x-2">
        <Select
          defaultValue={{
            value: options.type,
            label: `Top ${toUppercase(options.type)}`,
          }}
          ariaLabel="Select top artists or tracks"
          onChange={(value) => handleSetOptions("type", value)}
          value={options.type}
        >
          {types.map((value) => (
            <SelectOption key={value} value={value} label={`Top ${toUppercase(value)}`} />
          ))}
        </Select>
        <Select
          defaultValue={{
            label: titles[options.time_range],
            value: options.time_range,
          }}
          ariaLabel={`Select time frame`}
          onChange={(value) => handleSetOptions("time_range", value)}
          value={options.time_range}
        >
          {Object.entries(titles).map(([value, label]) => (
            <SelectOption key={value} value={value} label={label} />
          ))}
        </Select>
      </div>
      <hr className="w-full border-1 dark:border-primary-green border-slate-200 mt-4 mb-4" />
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
        }}
      >
        {data &&
          data.items.map((item) =>
            item.type === "artist" ? (
              <Link href={`/artist/${item.id}/top-tracks`} key={item.id}>
                <ListCard
                  title={item.name}
                  image={item.images[0]}
                  subtitle={item.genres.join(", ")}
                />
              </Link>
            ) : (
              <button className="text-left" onClick={() => updateAudio(item)} key={item.id}>
                <ListCard
                  title={item.name}
                  subtitle={item.artists.map(({ name }) => name).join(", ")}
                  image={item.album.images[0]}
                />
              </button>
            )
          )}
      </div>
      {/* {hasNextPage && (
        <Button action={fetchNextPage} className="mt-5">
          See More
        </Button>
      )} */}
    </Layout>
  );
}

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
  const type = (query.type as string) || "artists";
  const time_range = (query.time_range as string) || "short_term";
  const data = await fetcher(
    {
      url: `/me/top/${type}`,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      params: {
        time_range,
      },
    },
    spotify
  );
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=59");
  return {
    props: {
      data,
      session,
      type,
      time_range,
    },
  };
};
