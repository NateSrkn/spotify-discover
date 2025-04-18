"use client";
import { z } from "zod";
import { useInfiniteQuery } from "@tanstack/react-query";
import { spotify_queries } from "@/hooks/spotify/queries";
import { ListCard } from "@/components/ListCard";
import * as Select from "@radix-ui/react-select";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import type {
  Artist as ArtistType,
  Track as TrackType,
} from "@spotify/web-api-ts-sdk";
import { assertTrack } from "@/util/spotify";
import { ChevronDown } from "lucide-react";
import { createContext, PropsWithChildren, useContext } from "react";

import * as Artist from "@/components/Artist";
import * as Track from "@/components/Track";
export const DEFAULT_TERM = "short_term";
export const DEFAULT_TYPE = "artists";

export const trendingListSchema = z.object({
  time_range: z
    .enum(["short_term", "medium_term", "long_term"])
    .optional()
    .catch(DEFAULT_TERM),
  type: z.enum(["tracks", "artists"]).optional().catch(DEFAULT_TYPE),
});

export type TrendingListProps = z.infer<typeof trendingListSchema>;

const TrendingListContext = createContext<TrendingListProps>({
  time_range: DEFAULT_TERM,
  type: DEFAULT_TYPE,
});

const useTrendingListContext = () => {
  const context = useContext(TrendingListContext);
  if (!context) {
    throw new Error(
      "useTrendingListContext must be used within a TrendingListProvider",
    );
  }
  return context;
};

export const Root = ({
  children,
  ...props
}: PropsWithChildren<TrendingListProps>) => {
  const { time_range = DEFAULT_TERM, type = DEFAULT_TYPE } = props;
  const { data: params } = trendingListSchema.safeParse({
    time_range,
    type,
  });
  return (
    <TrendingListContext.Provider value={params}>
      {children}
    </TrendingListContext.Provider>
  );
};

export const List: React.FC<TrendingListProps> = () => {
  const params = useTrendingListContext();
  const { data, status, fetchNextPage, hasNextPage } = useInfiniteQuery(
    spotify_queries.trending(params),
  );
  if (status === "pending" || status === "error") {
    return null;
  }

  return (
    <section className="flex flex-col gap-4 mb-6">
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
        {data.pages.map((group) => {
          return group.items.map((item: ArtistType | TrackType) => {
            if (!assertTrack(item)) {
              return (
                <Artist.Root artist={item} key={item.id}>
                  <Artist.ArtistLink>
                    <ListCard
                      title={item.name}
                      subtitle={new Intl.ListFormat("en").format(item.genres)}
                      image={item.images[0]?.url}
                      type="artist"
                    />
                  </Artist.ArtistLink>
                </Artist.Root>
              );
            } else {
              return (
                <Artist.Root artist={item.artists[0]} key={item.id}>
                  <Artist.ArtistLink>
                    <ListCard
                      title={item.name}
                      subtitle={item.artists
                        .map((artist) => artist.name)
                        .join(", ")}
                      image={item.album.images[0]?.url}
                      type="artist"
                    />
                  </Artist.ArtistLink>
                </Artist.Root>
              );
            }
          });
        })}
      </div>
      {hasNextPage ? (
        <Button onClick={() => fetchNextPage()}>See More</Button>
      ) : null}
    </section>
  );
};

export const Controls = () => {
  const { time_range, type } = useTrendingListContext();
  const router = useRouter();
  const setTimeRange = (value: TrendingListProps["time_range"]) => {
    router.push(`?time_range=${value}&type=${type}`);
  };

  const setTrendingType = (value: TrendingListProps["type"]) => {
    router.push(`?time_range=${time_range}&type=${value}`);
  };

  return (
    <div className="flex items-start gap-2">
      <Select.Root onValueChange={setTrendingType} value={type}>
        <Select.Trigger
          aria-label="Time Range"
          className="inline-flex items-center justify-center rounded px-4 py-2 gap-2 text-sm font-medium text-white shadow-sm outline-none focus:outline-none focus:ring-1 focus:ring-secondary-green bg-primary-green"
        >
          <Select.Value />
          <Select.SelectIcon>
            <ChevronDown size={14} />
          </Select.SelectIcon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="overflow-hidden rounded-md bg-primary-green text-white"
            position="popper"
          >
            <Select.Viewport>
              <Select.Item
                value="artists"
                className="p-2 outline-none focus:outline-none focus:ring-1 focus:ring-secondary-green"
              >
                <Select.ItemText>Top Artists</Select.ItemText>
              </Select.Item>
              <Select.Item
                value="tracks"
                className="p-2 outline-none focus:outline-none focus:ring-1 focus:ring-secondary-green"
              >
                <Select.ItemText>Top Tracks</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <Select.Root onValueChange={setTimeRange} value={time_range}>
        <Select.Trigger
          aria-label="Time Range"
          className="inline-flex items-center justify-center rounded px-4 py-2 gap-2 text-sm font-medium text-white shadow-sm outline-none focus:outline-none focus:ring-1 focus:ring-secondary-green bg-primary-green"
        >
          <Select.Value placeholder="Select a time range" />
          <Select.SelectIcon>
            <ChevronDown size={14} />
          </Select.SelectIcon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="overflow-hidden rounded-md bg-primary-green text-white"
            position="popper"
          >
            <Select.Viewport className="flex flex-col gap-2">
              <Select.Item
                value="short_term"
                className="p-2 outline-none focus:outline-none focus:ring-1 focus:ring-secondary-green"
              >
                <Select.ItemText>Last Month</Select.ItemText>
              </Select.Item>
              <Select.Item
                value="medium_term"
                className="p-2 outline-none focus:outline-none focus:ring-1 focus:ring-secondary-green"
              >
                <Select.ItemText>6 Months</Select.ItemText>
              </Select.Item>
              <Select.Item
                value="long_term"
                className="p-2 outline-none focus:outline-none focus:ring-1 focus:ring-secondary-green"
              >
                <Select.ItemText>All Time</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};
