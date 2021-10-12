import React, { useState } from "react";
import Image from "./Image";
import { MouseFollower } from "./MouseFollower";
import cx from "classnames";
const Breadcrumb = ({ crumb, isActive, onClick }) => {
  const [isShowing, setIsShowing] = useState(false);

  return (
    <div>
      <div
        className={cx("img-wrapper is-rounded xs", {
          "border-2 dark:border-white border-black": isActive,
          "cursor-pointer": onClick,
        })}
        key={crumb.id}
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
        onClick={onClick ?? null}
      >
        <Image
          src={crumb.images[1]?.url}
          height={crumb.images[1]?.height}
          width={crumb.images[1]?.width}
          alt={crumb.name}
        />
      </div>
      {isShowing && (
        <MouseFollower offset={{ x: -50, y: 35 }}>
          <button className="bg-gray-200 dark:bg-faded-green p-2 rounded-md z-50 text-xs drop-shadow-lg">
            {crumb.name}
          </button>
        </MouseFollower>
      )}
    </div>
  );
};

export default Breadcrumb;
