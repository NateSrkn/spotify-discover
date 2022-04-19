import { useSession } from "next-auth/react";
import React from "react";
import { useNowPlaying } from "../hooks";
import Link, { ArtistLink } from "./Link";

export const NowPlaying = () => {
  const { data } = useSession();
  const { data: now_playing } = useNowPlaying(!!data);
  const isPlaying = !!now_playing?.item;

  return (
    <div className="flex sm:flex-row space-x-0 sm:space-x-2 w-full text-sm items-center">
      <div>
        {isPlaying ? <h6 className="text-xs subtext sm:hidden">Now Playing</h6> : null}
        <div className="inline-flex truncate flex-col sm:flex-row w-full sm:items-center">
          {isPlaying ? (
            <div className="truncate">
              <Link href={now_playing.item.href} className="truncate">
                {now_playing.item.name}
              </Link>
            </div>
          ) : (
            <p>Not Playing</p>
          )}
          <span className="mx-2 text-slate-200 dark:text-secondary-green hidden sm:block">
            {" – "}
          </span>
          <p className="subtext max-w-max truncate">
            {isPlaying ? (
              now_playing.item.artists.map((a, index) => (
                <ArtistLink id={a.id} key={a.id} className="group">
                  <span className="group-hover:underline">{a.name}</span>
                  {index !== now_playing.item.artists.length - 1 ? ", " : ""}
                </ArtistLink>
              ))
            ) : (
              <Link href={data?.user?.profile || "/"} className="hover:underline">
                Spotify
              </Link>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
