import React, { useContext, useEffect, useRef, useState } from "react";
import { MousePositionContext } from "./MouseTracker";

export const MouseFollower = ({ offset = { x: 0, y: 0 }, children }) => {
  const { x, y } = useContext(MousePositionContext);
  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });
  const ref = useRef({ offsetWidth: 0, offsetHeight: 0 });
  useEffect(() => {
    const { offsetWidth, offsetHeight } = ref.current;
    setDimensions({
      width: offsetWidth / 2,
      height: offsetHeight / 2,
    });
  }, []);
  return (
    <div
      style={{
        top: `${y - dimensions.height - offset.y}px`,
        left: `${x - dimensions.width - offset.x}px`,
      }}
      className="mouse-follower"
      ref={ref}
    >
      {children}
    </div>
  );
};
