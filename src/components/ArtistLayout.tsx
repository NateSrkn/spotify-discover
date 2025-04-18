"use client";
import React from "react";
import * as Artist from "@/components/Artist";
import { button } from "@/components/Button";

import { ExternalLink } from "lucide-react";

export const ArtistLayout: React.FC<{
  artist: SpotifyApi.ArtistObjectFull;
}> = ({ artist }) => {
  const image = artist.images[0];
  const linearGradient = `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))`;
  const backgroundImage = image?.url ? `url(${image?.url})` : "none";
  const followers = artist.followers.total.toLocaleString();

  return (
    <Artist.Root artist={artist}>
      <div
        className="w-full  h-[50vh] rounded-t-2xl overflow-hidden"
        style={{
          backgroundImage: `${linearGradient}, ${backgroundImage}`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex items-center gap-4 text-center md:text-left flex-wrap justify-center md:justify-start  py-6 px-4 ">
          <div className="space-y-4 hidden md:block">
            <section className="flex flex-col gap-4">
              <Artist.Name className="text-6xl font-bold text-wrap" as="h2" />
              <div className="flex flex-col gap-4">
                <div>{followers} Followers</div>
                <Artist.Genres />
              </div>
            </section>
          </div>
        </div>
      </div>
      <section className="flex flex-col gap-4 md:hidden py-6 px-4">
        <Artist.Name className="text-3xl text-wrap font-bold" as="h2" />
        <div className="flex items-center gap-4">
          <div>{followers} Followers</div>
          <Artist.Genres />
        </div>
      </section>
      <section className="flex flex-wrap gap-2  justify-start  p-4">
        <Artist.FollowButton />

        <Artist.SpotifyLink
          className={button({
            intent: "secondary",
            className: "gap-2",
          })}
        >
          <span>Open in Spotify</span>
          <ExternalLink size={16} />
        </Artist.SpotifyLink>
      </section>
    </Artist.Root>
  );
};
