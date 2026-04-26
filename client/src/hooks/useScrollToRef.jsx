// hooks/useScrollToRef.js
import { useEffect } from "react";

const useScrollToRef = (
  ref,
  dependencies = [],
  options = {},
  enabled = true,
) => {
  useEffect(() => {
    // ✅ Sirf tab scroll kare jab enabled === true aur ref  ho
    if (!enabled || !ref?.current) return;

    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
      ...options,
    });
  }, dependencies); // Dependencies change hone par hi check hoga
};

export default useScrollToRef;
