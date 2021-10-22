import { useRef } from "react";

export const useTimeout = (): [(callback: Function, delay?: number | null) => void, () => void] => {
  const timeout = useRef(null);
  const handleSetTimeout = (callback, delay = 500) => {
    const id = delay ? setTimeout(callback, delay) : setTimeout(callback);
    timeout.current = id;
  };

  const handleClearTimeout = () => {
    clearTimeout(timeout.current);
  };

  return [handleSetTimeout, handleClearTimeout];
};
