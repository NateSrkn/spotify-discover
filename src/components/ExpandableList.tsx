"use client";
import { HTMLAttributes, useState } from "react";
import { Button } from "@/components/Button";

import { ChevronDown, ChevronUp } from "lucide-react";

type ExpandableListProps = Omit<
  HTMLAttributes<HTMLUListElement>,
  "children"
> & {
  title?: string;
  children: React.ReactNode[];
  startingLength?: number;
};
export const ExpandableList = ({
  title,
  children,
  startingLength = 5,
  ...rest
}: ExpandableListProps) => {
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
            <Button onClick={() => setIsExpanded(!isExpanded)}>
              <div className="flex items-center gap-2">
                See {isExpanded ? "Less" : "More"}
              </div>
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        )}
      </div>
    );
  }
  return null;
};
