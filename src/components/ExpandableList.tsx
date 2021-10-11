import { useState } from "react";
import Image from "./Image";
import cx from "classnames";
import Button from "./Button";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export const ListItem = ({
  image,
  description,
  isRow,
  onClick,
}: {
  image: {
    url: string;
    height: number;
    width: number;
    isRounded?: boolean;
    size?: "xs" | "small";
    alt?: string;
  };
  description: string;
  isRow?: boolean;
  onClick?: () => void;
}) => {
  return (
    <li
      className={cx("w-full", {
        "my-2 hover:bg-gray-100 dark:hover:bg-green-custom p-1 cursor-pointer rounded-md":
          onClick,
        "my-3": !onClick,
      })}
      title={description}
    >
      <div
        className={cx("flex gap-4", {
          "flex-col": !isRow,
          "items-center": isRow,
        })}
      >
        <div
          className={cx(`img-wrapper ${image.size || ""}`, {
            "is-rounded": image?.isRounded,
          })}
        >
          <Image
            src={image.url}
            height={image.height}
            width={image.width}
            alt={image.alt || description}
          />
        </div>
        <div className="card-sm-text">{description}</div>
      </div>
    </li>
  );
};

const ExpandableList = ({
  title,
  children,
  startingLength = 5,
  config = { type: "list" },
}: {
  title: string;
  children: React.ReactNodeArray;
  startingLength?: number;
  config?: { type: "list" | "grid" };
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (children) {
    const listSize = isExpanded ? children.length : startingLength;
    const isShort = children.length <= startingLength;
    return (
      <div className="w-full">
        <h4 className="mb-2">{title}</h4>
        <ul
          className={cx({
            "grid grid-cols-3 sm:grid-cols-5 gap-3": config.type === "grid",
          })}
        >
          {children?.slice(0, listSize).map((item) => item)}
        </ul>
        {isExpanded ? (
          <Button onClick={() => setIsExpanded(false)}>
            <div className="flex items-end gap-2">
              See Less <FiChevronUp size={17} />
            </div>
          </Button>
        ) : (
          !isShort && (
            <Button onClick={() => setIsExpanded(true)}>
              <div className="flex items-end gap-2">
                See More <FiChevronDown size={17} />
              </div>
            </Button>
          )
        )}
      </div>
    );
  }
  return null;
};

export default ExpandableList;
