import { useEffect } from "react";
import { SimplifiedTopItem } from "../util/types/spotify";
import { Image, ListItem, ExpandableList, Breadcrumb, Button } from ".";
import cx from "classnames";
import React, { useState } from "react";
import { prefetchArtist, useArtist } from "../hooks";
import { AnimatePresence, motion } from "framer-motion";
import { useQueryClient } from "react-query";

export const Artist = ({
  baseArtist,
  onMouseEnter,
  onMouseLeave,
  onClick,
  handleClose,
  isActive = false,
}: {
  baseArtist: SimplifiedTopItem;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick: () => void;
  handleClose: () => void;
  isActive?: boolean;
}) => {
  const queryClient = useQueryClient();
  const [timeout, updateTimeout] = useState<typeof setTimeout | null>();
  const [activeBreadcrumb, setActiveBreadcrumb] = useState(baseArtist);
  const [placeholder, setPlaceholder] = useState(baseArtist);
  const { data, isFetched } = useArtist({
    id: activeBreadcrumb.id,
    placeholderData: { artist: placeholder },
    isEnabled: isActive,
  });

  const [breadCrumbs, setBreadCrumbs] = useState([baseArtist]);
  const handleClick = isActive ? handleClose : onClick;
  const handleAddBreadcrumb = (item) => {
    if (breadCrumbs.some((i) => i.id === item.id)) return;
    setBreadCrumbs([...breadCrumbs, item]);
  };

  useEffect(
    () => !isActive && setActiveBreadcrumb(baseArtist),
    [isActive, baseArtist]
  );

  const isBreadcrumb = (item) => item.id !== baseArtist.id;

  const handleAction = (event, action) => {
    event.stopPropagation();
    action();
  };
  const handleSetActiveBreadcrumb = (item) => {
    setPlaceholder(item);
    setActiveBreadcrumb(item);
    handleAddBreadcrumb(item);
  };

  const handleRemoveBreadcrumb = (item) => {
    const index = breadCrumbs.findIndex((i) => i.id === item.id);
    const replacement = breadCrumbs[index - 1];
    setActiveBreadcrumb(replacement);
    setPlaceholder(replacement);
    setBreadCrumbs(breadCrumbs.filter((i) => i.id !== item.id));
  };
  return (
    <React.Fragment>
      <AnimatePresence>
        {isActive && breadCrumbs.length ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-2 flex-wrap"
          >
            {breadCrumbs.map((crumb) => (
              <Breadcrumb
                crumb={crumb}
                key={crumb.id}
                isActive={crumb.id === activeBreadcrumb.id}
                onClick={() => handleSetActiveBreadcrumb(crumb)}
              />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div
        className="w-full bg-gray-200 dark:bg-faded-green justify-self-start relative items-start flex flex-row shadow-md rounded-md group overflow-hidden"
        aria-selected={isActive}
        aria-current={isActive}
        aria-expanded={isActive}
      >
        <div className="flex flex-col w-full min-w-full flex-wrap">
          <div
            className={cx({
              "border-b border-green-custom": isActive,
            })}
          >
            <div
              className="p-5 flex flex-row md:flex-row cursor-pointer bg-gray-200 dark:bg-faded-green transition-all items-center gap-4 w-full"
              onMouseEnter={
                onMouseEnter
                  ? (event) => handleAction(event, onMouseEnter)
                  : null
              }
              onMouseLeave={
                onMouseLeave
                  ? (event) => handleAction(event, onMouseLeave)
                  : null
              }
              onClick={
                handleClick ? (event) => handleAction(event, handleClick) : null
              }
            >
              <div
                className={cx(
                  "overflow-hidden rounded-full shadow-md flex-shrink-0 transition-all",
                  {
                    "md:w-32 md:h-32 w-20 h-20": isActive,
                    "md:w-28 md:h-28 w-20 h-20": !isActive,
                  }
                )}
              >
                <Image
                  src={data.artist.images[0]?.url}
                  height={data.artist.images[0]?.height}
                  width={data.artist.images[0]?.width}
                  alt={data.artist.name}
                />
              </div>
              <div>
                <h3
                  className={cx("truncate text-md font-medium transition-all", {
                    "sm:text-xl font-bold": isActive,
                    "group-hover:underline": !isActive,
                  })}
                >
                  {data.artist.name}
                </h3>
                <div className="text-sm subtext">
                  {data.artist.genres.string ?? data.artist.genres.join(", ")}
                </div>
              </div>

              {!isActive && breadCrumbs.length > 1 && (
                <div className="bg-gray-100 dark:bg-green-custom px-2 py-1 rounded-md self-start ml-auto text-sm">
                  {breadCrumbs.length}
                </div>
              )}
              {isActive && isBreadcrumb(data.artist) && (
                <div className="mt-2 md:ml-auto md:self-end">
                  <Button
                    onClick={(event) =>
                      handleAction(event, () =>
                        handleRemoveBreadcrumb(data.artist)
                      )
                    }
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>
          <AnimatePresence>
            {isActive && !isFetched && (
              <motion.div
                className="p-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Loading...
              </motion.div>
            )}
            {isActive && isFetched && (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div className="flex flex-col gap-4 p-5 md:col-span-4">
                  <ExpandableList title="Top Tracks">
                    {data?.top_tracks?.map(({ album, ...track }) => (
                      <ListItem
                        key={track.id}
                        description={track.name}
                        image={{
                          url: album.images[2]?.url,
                          height: album.images[2]?.height,
                          width: album.images[2]?.width,
                          alt: album.name,
                          size: "xs",
                        }}
                        isRow={true}
                      />
                    ))}
                  </ExpandableList>
                  <ExpandableList title="Albums" config={{ type: "grid" }}>
                    {data?.collection?.album?.map(({ images, ...album }) => (
                      <ListItem
                        key={album.id}
                        description={album.name}
                        image={{
                          url: images[1]?.url,
                          height: images[1]?.height,
                          width: images[1]?.width,
                          alt: album.name,
                        }}
                      />
                    ))}
                  </ExpandableList>
                  <ExpandableList title="Singles" config={{ type: "grid" }}>
                    {data?.collection?.single?.map(({ images, ...album }) => (
                      <ListItem
                        key={album.id}
                        description={album.name}
                        image={{
                          url: images[1]?.url,
                          height: images[1]?.height,
                          width: images[1]?.width,
                          alt: album.name,
                        }}
                      />
                    ))}
                  </ExpandableList>
                  <ExpandableList
                    title="Compilations"
                    config={{ type: "grid" }}
                  >
                    {data?.collection?.compilation?.map(
                      ({ images, ...album }) => (
                        <ListItem
                          key={album.id}
                          description={album.name}
                          image={{
                            url: images[1]?.url,
                            height: images[1]?.height,
                            width: images[1]?.width,
                            alt: album.name,
                          }}
                        />
                      )
                    )}
                  </ExpandableList>
                </motion.div>
                <motion.div className="px-5 pb-5 md:p-5 md:border-l border-green-custom col-span-2">
                  <ExpandableList title="Related Artists" startingLength={10}>
                    {data?.related_artists
                      ?.filter(
                        (artist) =>
                          !breadCrumbs.some((crumb) => crumb.id === artist.id)
                      )
                      .map(({ images, ...artist }) => (
                        <ListItem
                          key={artist.id}
                          description={artist.name}
                          image={{
                            url: images[2]?.url,
                            height: images[2]?.height,
                            width: images[2]?.width,
                            alt: artist.name,
                            size: "xs",
                            isRounded: true,
                          }}
                          onMouseEnter={() =>
                            updateTimeout(
                              setTimeout(() => {
                                prefetchArtist(queryClient, artist.id);
                              }, 500)
                            )
                          }
                          onMouseLeave={() => {
                            clearTimeout(timeout);
                            setTimeout(null);
                          }}
                          onClick={() =>
                            handleSetActiveBreadcrumb({ ...artist, images })
                          }
                          isRow={true}
                        />
                      ))}
                  </ExpandableList>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </React.Fragment>
  );
};
