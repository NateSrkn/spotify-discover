import React from "react";
import { Image } from ".";
import cx from "classnames";
export const Breadcrumb = ({ crumb, isActive, onClick = null }) => {
  return (
    <div className="relative group">
      <div
        className={cx("img-wrapper is-rounded xs", {
          "border-2 dark:border-white border-black": isActive,
          "cursor-pointer": onClick,
        })}
        key={crumb.id}
        onClick={onClick ?? null}
      >
        <Image
          src={crumb.images[1]?.url}
          height={crumb.images[1]?.height}
          width={crumb.images[1]?.width}
          alt={crumb.name}
        />
      </div>
      <div className="hidden sm:invisible sm:block group-hover:visible absolute bottom-12 w-max shadow-lg z-50 drop-shadow-2xl bg-gray-200 dark:bg-faded-green px-2 py-1 rounded-md">
        <span className="text-xs">{crumb.name}</span>
      </div>
    </div>
  );
};
