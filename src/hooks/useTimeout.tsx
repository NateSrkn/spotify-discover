import { useState } from "react";

export const useTimeout = (): [
  (callback: Function, delay?: number | null) => void,
  () => void
] => {
  const [timeout, createTimeout] = useState(null);

  const handleSetTimeout = (callback, delay = 500) => {
    const id = delay ? setTimeout(callback, delay) : setTimeout(callback);
    createTimeout(id);
  };

  const handleClearTimeout = () => {
    clearTimeout(timeout);
    createTimeout(null);
  };

  return [handleSetTimeout, handleClearTimeout];
};
