"use client";
import {
  createContext,
  ElementType,
  FC,
  HTMLAttributes,
  PropsWithChildren,
  use,
} from "react";
import ArtistObjectFull = SpotifyApi.ArtistObjectFull;
import ArtistObjectSimplified = SpotifyApi.ArtistObjectSimplified;
import Link from "next/link";
import cx from "classnames";
import { MicVocal } from "lucide-react";
import { DynamicComponent, DynamicComponentProps } from "@/components/Dynamic";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ME_URL, user_queries, withAuthHeader } from "@/hooks/spotify/queries";
import { Button } from "@/components/Button";
import ky from "ky";
import { useSession } from "next-auth/react";
import type {
  Artist as ArtistType,
  SimplifiedArtist,
} from "@spotify/web-api-ts-sdk";

type FullArtistContext = {
  artist: ArtistObjectFull;
  type: "full";
};

type SimplifiedArtistContext = {
  artist: ArtistObjectSimplified;
  type: "simplified";
};
type ArtistContext = FullArtistContext | SimplifiedArtistContext;
const ArtistContext = createContext<ArtistContext>({
  artist: null,
  type: "simplified",
});

export const Root: FC<
  PropsWithChildren<{
    artist:
      | ArtistObjectFull
      | ArtistObjectSimplified
      | ArtistType
      | SimplifiedArtist;
  }>
> = ({ children, artist }) => {
  return (
    <ArtistContext.Provider
      value={
        {
          artist,
          type: assertFullArtist(artist) ? "full" : "simplified",
        } as ArtistContext
      }
    >
      {children}
    </ArtistContext.Provider>
  );
};

export const ArtistImage: FC<
  HTMLAttributes<HTMLImageElement> & { index: number }
> = (props) => {
  const { artist, type } = use(ArtistContext);
  if (!artist || type === "simplified") return null;
  const { index = 0, className, ...rest } = props;
  const image = artist.images[index];
  if (!image)
    return (
      <div
        className={cx(
          "flex  aspect-square items-center justify-center bg-gradient-to-bl from-pewter-blue/50 to-pewter-blue/90",
          className,
        )}
        {...rest}
      >
        <MicVocal />
      </div>
    );
  return (
    <img
      src={image?.url}
      height={image?.height}
      width={image?.width}
      alt={artist.name}
      className={cx("aspect-square object-cover", className)}
      {...rest}
    />
  );
};

export const Name = <T extends ElementType>(
  props: DynamicComponentProps<T>,
) => {
  const { artist } = use(ArtistContext);
  return <DynamicComponent {...props}>{artist.name}</DynamicComponent>;
};

export const Genres: FC<HTMLAttributes<HTMLSpanElement>> = (props) => {
  const { artist, type } = use(ArtistContext);
  if (!artist || type === "simplified") return null;
  return (
    <span {...props}>{artist.genres.map((genre) => genre).join(", ")}</span>
  );
};

export const SpotifyLink = (props: HTMLAttributes<HTMLAnchorElement>) => {
  const { artist } = use(ArtistContext);
  const { children, ...rest } = props;
  return (
    <a href={artist.external_urls.spotify} target="_blank" {...rest}>
      {children}
    </a>
  );
};

export const FollowButton = (props: HTMLAttributes<HTMLButtonElement>) => {
  const { artist } = use(ArtistContext);
  const queryClient = useQueryClient();
  const session = useSession();
  const following = useQuery(
    user_queries.following_artist(artist.id, session?.data?.access_token),
  );
  const follow = useMutation({
    mutationKey: ["follow", artist.id],
    mutationFn: async ({ isFollowing }: { isFollowing: boolean }) => {
      console.log(isFollowing);
      if (!session.data) return;
      const response = await ky(`${ME_URL}/following`, {
        ...withAuthHeader(session.data.access_token),
        json: {
          ids: [artist.id],
        },
        method: isFollowing ? "DELETE" : "PUT",
        searchParams: {
          type: "artist",
        },
      });
      return response.ok;
    },
    onMutate: async () => {
      await queryClient.cancelQueries(user_queries.following_artist(artist.id));

      const previous = queryClient.getQueryData(
        user_queries.following_artist(artist.id).queryKey,
      );
      queryClient.setQueryData(
        user_queries.following_artist(artist.id).queryKey,
        (old) => !old,
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        user_queries.following_artist(artist.id).queryKey,
        context.previous,
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries(user_queries.following_artist(artist.id)),
  });
  return (
    <Button
      intent="secondary"
      className={cx({
        "bg-spotify/10": following.data,
      })}
      onClick={() =>
        follow.mutate({
          isFollowing: following.data,
        })
      }
      {...props}
    >
      {following.data ? "Following" : "Follow"}
    </Button>
  );
};

export const ArtistLink: FC<HTMLAttributes<HTMLAnchorElement>> = (props) => {
  const { artist } = use(ArtistContext);
  const { children, ...rest } = props;
  return (
    <Link href={`/artist/${artist.id}`} {...rest}>
      {children}
    </Link>
  );
};

const assertFullArtist = (
  artist:
    | ArtistObjectFull
    | ArtistObjectSimplified
    | ArtistType
    | SimplifiedArtist,
): artist is ArtistObjectFull => {
  return "images" in artist;
};
