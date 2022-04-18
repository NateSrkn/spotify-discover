import NextLink, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import { useTimeout } from "../hooks";
import { prefetch } from "../util/api";

export interface ILink extends LinkProps {
  forceNewTab?: boolean;
  className?: string;
  swrKey?: string | string[];
  handleAction?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
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
  const isNewTab = forceNewTab || href.startsWith("http");
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
    <NextLink href={href} passHref {...props}>
      <a
        rel={rel}
        target={target}
        onClick={handleRouteChange}
        className={className}
        onMouseEnter={handlePrefetch}
        onMouseLeave={handleClearTimeout}
        onFocus={handlePrefetch}
      >
        {children}
      </a>
    </NextLink>
  );
};
