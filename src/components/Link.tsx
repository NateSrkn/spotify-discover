import cx from "classnames";
import NextLink, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useSWRConfig } from "swr";
import { useTimeout } from "../hooks";
import { prefetch } from "../util/api";
import { requests } from "../util/helpers";

export interface ILink extends LinkProps {
  forceNewTab?: boolean;
  className?: string;
  swrKey?: string | string[];
  handleAction?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  children: React.ReactNode;
}
export const Link: React.FC<ILink> = ({
  href,
  children,
  forceNewTab,
  className,
  swrKey,
  handleAction,
  ...props
}) => {
  const { cache } = useSWRConfig();
  const [handleSetTimeout, handleClearTimeout] = useTimeout();
  const isNewTab = forceNewTab || (typeof href === "string" && href.startsWith("http"));
  const rel = isNewTab ? "noopener noreferrer" : undefined;
  const target = isNewTab ? "_blank" : "_self";
  const router = useRouter();
  const handleRouteChange = (event) => {
    event.stopPropagation();
    if (handleAction) handleAction(event);
    if (!isNewTab) {
      event.preventDefault();
      router.push(href, undefined, props);
    }
  };

  const handlePrefetch = () =>
    handleSetTimeout(() => {
      if (!swrKey) return;
      const hasKey = (key) => cache.get(key);
      if (typeof swrKey === "string") {
        if (hasKey(swrKey)) return;
        prefetch(swrKey);
      }
      if (Array.isArray(swrKey)) {
        swrKey.forEach((key) => {
          if (hasKey(key)) return;
          prefetch(key);
        });
      }
    }, 200);

  return (
    <NextLink
      href={href}
      passHref
      {...props}
      rel={rel}
      target={target}
      onClick={handleRouteChange}
      className={className}
      onMouseEnter={handlePrefetch}
      onMouseLeave={handleClearTimeout}
      onFocus={handlePrefetch}
    >
      {children}
    </NextLink>
  );
};

export const ArtistLink: React.FC<{ id: string; children: React.ReactNode } & ILink> = ({
  id,
  children,
  ...rest
}) => {
  return (
    <Link href={`/artist/${id}/top-tracks`} swrKey={requests["artist"](id)} {...rest}>
      {children}
    </Link>
  );
};

export const TabLink: React.FC<ILink> = ({ children, href, className }) => {
  const router = useRouter();
  const { album } = router.query;
  const isActive = album
    ? `${href}&album=${album}` === router.asPath
    : href === router.asPath || router.asPath.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={cx(
        "tab",
        {
          active: isActive,
        },
        className
      )}
      scroll={false}
    >
      {children}
    </Link>
  );
};

export default Link;
