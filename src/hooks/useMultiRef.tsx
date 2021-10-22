import { useRef } from "react";

export const useMultiRef = (): [(node, id) => void, (id) => HTMLElement] => {
  const ref = useRef(null);

  const getMap = () => {
    if (!ref.current) {
      ref.current = new Map();
    }
    return ref.current;
  };

  const setRef = (node, id) => {
    const map = getMap();
    if (node) {
      map.set(id, node);
    } else {
      map.delete(id);
    }
  };

  const getRef = (id) => {
    const map = getMap();
    return map.get(id);
  };

  return [setRef, getRef];
};
