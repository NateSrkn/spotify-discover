import { GetServerSideProps } from "next";
import React, { useContext, useEffect, useState } from "react";
import { toUppercase } from "../util/helpers";
import { useNowPlaying, useTopItems } from "../hooks";
import { Select, Layout, SelectOption, Button } from "../components";
import { Options, TermLengths, TypesList } from "../util/types/spotify";
import { ArtistLink } from "../components/Link";
import { ListCard, SkeletonListCard } from "../components/ListCard";
import { AudioContext } from "../providers";
import { useRouter } from "next/router";
import { Skeleton } from "../components/Skeleton";

export default function Dashboard({
  type = TypesList.ARTISTS,
  time_range = TermLengths.SHORT_TERM,
}) {
  const { updateAudio } = useContext(AudioContext);
  const [options, setOptions] = useState<Options>({
    type,
    time_range,
  });
  const { data: now_playing } = useNowPlaying();
  const { data, size, setSize, hasNext, isValidating } = useTopItems(
    options.type,
    options.time_range
  );
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
          onChange={(value) =>
            router.push({ query: { ...options, type: value } }, null, { shallow: true })
          }
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
          onChange={(value) =>
            router.push({ query: { ...options, time_range: value } }, null, { shallow: true })
          }
          value={options.time_range}
        >
          {Object.entries(titles).map(([value, label]) => (
            <SelectOption key={value} value={value} label={label} />
          ))}
        </Select>
      </div>
      <hr className="w-full border-1 border-primary-green mt-4 mb-4" />
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
        {data && data.length ? (
          data.map((page) =>
            page.items.map((item) =>
              item.type === "artist" ? (
                <ArtistLink id={item.id} key={item.id}>
                  <ListCard
                    title={item.name}
                    image={item.images[0].url}
                    subtitle={item.genres.join(", ")}
                  />
                </ArtistLink>
              ) : (
                <button className="text-left" onClick={() => updateAudio(item)} key={item.id}>
                  <ListCard
                    title={item.name}
                    subtitle={item.artists.map(({ name, id }, index) => (
                      <ArtistLink id={id} key={id} className="group">
                        <span className="hover:underline">{name}</span>
                        {index !== item.artists.length - 1 ? ", " : ""}
                      </ArtistLink>
                    ))}
                    image={item.album.images[0].url}
                  />
                </button>
              )
            )
          )
        ) : (
          <Skeleton count={20} component={SkeletonListCard} />
        )}
        {isValidating && <Skeleton count={20} component={SkeletonListCard} />}
      </div>

      {data && !hasNext(data[data.length - 1]) && (
        <Button action={() => setSize(size + 1)} className="mt-5">
          See More
        </Button>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const type = (query.type as string) || "artists";
  const time_range = (query.time_range as string) || "short_term";
  return {
    props: {
      type,
      time_range,
    },
  };
};
