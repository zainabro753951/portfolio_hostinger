// HomeHeroBrandX.jsx
// Ultra‑premium brand hero inspired by GSAP / Linear / Stripe

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import CircularBadge from "../../../components/CircularBadge";
import HeroSkeleton from "./HeroSkeleton";

/* ---------------- Animations (clean & premium) ---------------- */

export default function HomeHeroBrandX() {
  const { data: about, isLoading: isAboutLoading } = useSelector(
    (state) => state.about,
  );

  const { site_info, isLoading: isSiteSettingLoading } = useSelector(
    (state) => state.siteSettings,
  );

  const anim = useMemo(
    () => ({
      container: {
        hidden: {},
        show: { transition: { staggerChildren: 0.14 } },
      },
      fade: {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.5 } },
      },
      slide: {
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      },
      scaleIn: {
        hidden: { opacity: 0, scale: 0.92 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.7, ease: "easeOut" },
        },
      },
      floatSlow: {
        animate: { y: [0, -14, 0] },
        transition: { duration: 7, repeat: Infinity, ease: "easeInOut" },
      },
    }),
    [],
  );

  /* ---------------- Title logic ---------------- */
  const title =
    site_info?.tagline || "Crafting Digital Experiences For Modern Brands";
  const words = title.split(" ");

  // ---------------- Decide how many words to highlight ----------------
  let highlightCount = 2; // default
  if (words.length <= 4) {
    highlightCount = 1; // short title → only 1 middle word
  } else if (words.length >= 8) {
    highlightCount = 3; // long title → highlight 3 middle words
  } else {
    highlightCount = 2; // medium → highlight 2 words
  }

  // ---------------- Determine start index for middle highlight ----------------
  const startIndex = Math.floor((words.length - highlightCount) / 2);

  // ---------------- Slice ----------------
  const highlight = words
    .slice(startIndex, startIndex + highlightCount)
    .join(" ");
  const normalStart = words.slice(0, startIndex).join(" ");
  const normalEnd = words.slice(startIndex + highlightCount).join(" ");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const move = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  const glowX = useTransform(mouseX, [-500, 500], [-60, 60]);
  const glowY = useTransform(mouseY, [-500, 500], [-60, 60]);

  if (isAboutLoading || isSiteSettingLoading) {
    return <HeroSkeleton />;
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0b10] text-white md:py-10 xs:py-20">
      {/* Ambient gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(34,211,238,0.18),transparent_45%)]" />

      {/* Cursor glow */}
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[140px]"
      />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2">
        {/* LEFT — Brand copy */}
        <div className="space-y-8">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block rounded-full border border-white/10 bg-white/5 px-5 py-2 md:text-sm xs:text-[11px] uppercase tracking-widest text-white/70"
          >
            Creative Developer · Brand UI
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="md:text-5xl xs:text-3xl font-semibold md:leading-13 xs:leading-8"
          >
            {normalStart}
            <br />
            <span className="bg-linear-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {highlight}
            </span>
            <br />
            {normalEnd}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl md:text-lg xs:text-md leading-relaxed text-white/65"
          >
            {about?.shortDesc}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-6"
          >
            <button className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-medium text-black">
              <span className="relative z-10">View Work</span>
              <span className="absolute inset-0 translate-y-full bg-linear-to-r from-indigo-400 to-cyan-400 transition-transform duration-500 group-hover:translate-y-0" />
            </button>
            <a className="text-sm tracking-wide text-white/60 hover:text-white transition">
              Contact
            </a>
          </motion.div>
        </div>

        {/* ---------------- RIGHT / VISUAL ---------------- */}
        <motion.div
          variants={anim.scaleIn}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative flex justify-center"
        >
          {/* Neon ring */}
          <motion.div
            {...anim.floatSlow}
            className="absolute w-[420px] h-[420px] rounded-full border border-white/10"
          />

          {/* Glow */}
          <div className="absolute w-[380px] h-[380px] rounded-full blur-[120px] bg-linear-to-tr from-cyan-500/25 to-fuchsia-500/30" />

          {/* Image glass card */}
          <div className="relative rounded-[28px] p-4 backdrop-blur-2xl bg-white/5 border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
            <CircularBadge aboutImage={about?.aboutImage || null} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
