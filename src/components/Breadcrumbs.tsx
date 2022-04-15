import { useRouter } from "next/router";
import React from "react";
import { SpotifyImage } from "../util/types/spotify";
import { Image } from "./Image";
import { Link } from "./Link";

const Breadcrumbs = ({ crumbs }: { crumbs: Crumb[] }) => {
  const router = useRouter();
  const isActive = (href: Crumb["href"]) => router.asPath.includes(href);
  return (
    <nav>
      <ul className="flex gap-2">
        {crumbs.map((crumb, i) => (
          <li key={crumb.href}>
            <Link href={crumb.href}>
              <Image src={crumb.image.url} width={50} height={50} className="rounded-full shadow" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export type Crumb = {
  label: string;
  href: string;
  image?: SpotifyImage;
};

export default Breadcrumbs;
