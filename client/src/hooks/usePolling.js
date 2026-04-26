import { useEffect } from "react";

export const usePolling = (callback, delay = 30000, enabled = true) => {
  useEffect(() => {
    if (!enabled) return undefined;
    callback();
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay, enabled]);
};
