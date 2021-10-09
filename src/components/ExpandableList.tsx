import { useState } from "react";
import Image from "next/image";
const ExpandableList = ({ title, list, startingLength = 5 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const listSize = isExpanded ? list.length : startingLength;
  const isShort = list.length <= startingLength;
  return (
    <div>
      <h4 className="text-lg font-bold mb-2">{title}</h4>
      <ul>
        {list.slice(0, listSize).map((item) => (
          <li key={item.key} className="my-1">
            <div className="flex flex-row items-center gap-4">
              {item.image && (
                <div className="flex-shrink-0 shadow-md">
                  <Image
                    src={item.image}
                    alt={item.title}
                    height={45}
                    width={45}
                  />
                </div>
              )}
              <div className="truncate font-medium">{item.text}</div>
            </div>
          </li>
        ))}
      </ul>
      {isExpanded ? (
        <a
          onClick={() => setIsExpanded(false)}
          className="hover:underline cursor-pointer font-medium"
        >
          See Less
        </a>
      ) : (
        !isShort && (
          <a
            onClick={() => setIsExpanded(true)}
            className="hover:underline cursor-pointer font-medium"
          >
            See More
          </a>
        )
      )}
    </div>
  );
};

export default ExpandableList;
