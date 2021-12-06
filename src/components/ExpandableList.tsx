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
  isActive,
}: {
  image: {
    url: string;
    height: number;
    width: number;
    isRounded?: boolean;
    size?: "breadcrumb" | "album";
    alt?: string;
  };
  description: string;
  isRow?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isActive?: boolean;
}) => {
  return (
    <li
      className={cx("w-full", {
        "my-2 hover:bg-gray-100 dark:hover:bg-green-custom p-1 cursor-pointer rounded-md transition-all":
          onClick,
        "my-3": !onClick,
        "bg-green-custom": isActive,
      })}
      title={description}
      onMouseEnter={onMouseEnter ?? null}
      onMouseLeave={onMouseLeave ?? null}
      onClick={onClick ?? null}
    >
      <div
        className={cx("flex gap-2", {
          "flex-col": !isRow,
          "items-center": isRow,
        })}
      >
        <div
          className={cx(`img-wrapper ${image.size ?? ""}`, {
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
  ...rest
}: {
  title?: string;
  children: React.ReactNodeArray;
  startingLength?: number;
  [key: string]: any;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (children) {
    const listSize = isExpanded ? children.length : startingLength;
    const isShort = children.length <= startingLength;
    return (
      <div className="w-full">
        {title && <h4 className="mb-2">{title}</h4>}
        <ul {...rest}>{children?.slice(0, listSize).map((item) => item)}</ul>
        {!isShort && (
          <div className="my-2">
            <Button
              action={() => setIsExpanded(!isExpanded)}
              icon={isExpanded ? FiChevronUp : FiChevronDown}
              iconPosition="right"
            >
              <div className="flex items-center gap-2">See {isExpanded ? "Less" : "More"}</div>
            </Button>
          </div>
        )}
      </div>
    );
  }
  return null;
};
