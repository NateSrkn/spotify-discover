import { useState } from "react";
import { Image, Button } from ".";
import cx from "classnames";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export const ListItem = ({
  image,
  description,
  isRow,
  onClick,
  onMouseEnter,
  onMouseLeave,
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
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => {
  return (
    <li
      className={cx("w-full", {
        "my-2 hover:bg-gray-100 dark:hover:bg-green-custom p-1 cursor-pointer rounded-md":
          onClick,
        "my-3": !onClick,
      })}
      title={description}
      onMouseEnter={onMouseEnter ?? null}
      onMouseLeave={onMouseLeave ?? null}
      onClick={onClick ?? null}
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

export const ExpandableList = ({
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
        {!isShort && (
          <Button onClick={() => setIsExpanded(!isExpanded)}>
            <div className="flex items-end gap-2">
              See {isExpanded ? "Less" : "More"}{" "}
              {isExpanded ? (
                <FiChevronUp size={17} />
              ) : (
                <FiChevronDown size={17} />
              )}
            </div>
          </Button>
        )}
      </div>
    );
  }
  return null;
};
