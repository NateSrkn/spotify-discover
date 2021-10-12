import React, { useState, createContext } from "react";

export const MousePositionContext = createContext({ x: 0, y: 0 });

export const MouseTracker = ({ children, ...other }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMousePosition = (event) => {
    setMousePosition({
      x: event.pageX,
      y: event.pageY,
    });
  };
  return (
    <MousePositionContext.Provider value={mousePosition}>
      <div
        onMouseMove={handleMousePosition}
        aria-label="Container to track the mouse position"
        {...other}
      >
        {children}
      </div>
    </MousePositionContext.Provider>
  );
};
