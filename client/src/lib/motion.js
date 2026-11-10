// Shared motion presets — import from 'motion/react' ONLY (never framer-motion / gsap).
// Rules: transform + opacity only, viewport once, respect reduced motion,
// lighter distances/staggers on mobile. See /DESIGN_SYSTEM.md §Motion.
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export const EASE_OUT = [0.16, 1, 0.3, 1];
export const VIEWPORT_ONCE = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -10% 0px",
};

const MOBILE_QUERY = "(max-width: 767px)";

/** { reduced, isMobile } — drives distance/stagger/decorative toggles */
export function useMotionPrefs() {
  const reduced = useReducedMotion() ?? false;
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.matchMedia(MOBILE_QUERY).matches
      : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return { reduced, isMobile };
}

/** Fade-up reveal. Desktop 24px, mobile 12px, reduced = opacity only. */
export const fadeUp = ({ reduced, isMobile }, delay = 0) => ({
  hidden: { opacity: 0, y: reduced ? 0 : isMobile ? 12 : 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: reduced ? 0.01 : isMobile ? 0.4 : 0.6,
      ease: EASE_OUT,
      delay,
    },
  },
});

/** Parent variant for staggered children. */
export const staggerParent = ({ reduced, isMobile }) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: reduced ? 0 : isMobile ? 0.05 : 0.1 },
  },
});
