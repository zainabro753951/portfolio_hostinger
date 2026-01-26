// FeaturedReposModern.jsx
import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useSelector } from "react-redux";
import GardientButton from "./GardientButton";
import { Link } from "react-router-dom";
import { colorGuess } from "../Utils/Utils";
import FeaturedReposSkeleton from "./FeaturedRepoSkeleton";

/**
 * FeaturedReposModern.jsx
 * - Drop-in replacement for Featured Repositories
 * - Preserves Redux data, responsive, accessible, performance-friendly
 */

export default function FeaturedReposModern() {
  const prefersReducedMotion = useReducedMotion();
  // const { projects = [], isLoading } = useSelector((s) => s.projects || {});
  // const [isReady, setIsReady] = useState(false);

  // useEffect(() => {
  //   if (!isLoading) {
  //     // small delay so skeleton -> content transition feels smooth
  //     const t = setTimeout(() => setIsReady(true), 180);
  //     return () => clearTimeout(t);
  //   }
  // }, [isLoading]);

  // if (isLoading || !isReady) return <FeaturedReposSkeleton />;

  // if (!projects || projects.length === 0) {
  //   return (
  //     <section className="w-full bg-[#050617] text-white py-24">
  //       <div className="max-w-7xl mx-auto px-6 text-center text-white/70">
  //         <h3 className="text-xl font-semibold">
  //           No featured repositories found
  //         </h3>
  //       </div>
  //     </section>
  //   );
  // }

  const projects = [
    {
      _id: "65f1a2b3c4d5e6f7g8h9i0j1",
      title: "E-Commerce Dashboard",
      slug: "e-commerce-dashboard",
      shortDesc:
        "Ek full-stack admin dashboard jisme real-time sales analytics, inventory management aur dark mode support shamil hai.",
      heroImage: {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
      },
      techStack: [
        { name: "React" },
        { name: "Tailwind CSS" },
        { name: "Node.js" },
      ],
      liveDemo: "https://example-dashboard.com",
      repoLink: "https://github.com/username/dashboard",
    },
    {
      _id: "65f2a3b4c5d6e7f8g9h0i1j2",
      title: "AI Image Generator",
      slug: "ai-image-generator",
      shortDesc:
        "OpenAI API ka use karte hue text prompts se unique images generate karne wala tool.",
      heroImage: {
        url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000",
      },
      techStack: [
        { name: "Next.js" },
        { name: "TypeScript" },
        { name: "OpenAI" },
      ],
      liveDemo: "https://ai-gen-demo.com",
      repoLink: "https://github.com/username/ai-gen",
    },
    {
      _id: "65f3a4b5c6d7e8f9g0h1i2j3",
      title: "Travel Booking App",
      slug: "travel-booking-app",
      shortDesc:
        "Duniya bhar ke hotels aur flights book karne ke liye user-friendly application.",
      heroImage: {
        url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1000",
      },
      techStack: [{ name: "Vue.js" }, { name: "Firebase" }, { name: "Sass" }],
      liveDemo: "https://travel-app-demo.com",
      repoLink: "https://github.com/username/travel-app",
    },
    {
      _id: "65f4a5b6c7d8e9f0g1h2i3j4",
      title: "Crypto Portfolio Tracker",
      slug: "crypto-tracker",
      shortDesc:
        "Cryptocurrency prices aur portfolio value ko track karne ke liye live API integration.",
      heroImage: {
        url: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=1000",
      },
      techStack: [
        { name: "Angular" },
        { name: "RxJS" },
        { name: "CoinGecko API" },
      ],
      liveDemo: "https://crypto-track-demo.com",
      repoLink: "https://github.com/username/crypto-tracker",
    },
  ];

  return (
    <section className="w-full bg-[#050617] text-white font-inter py-16 md:py-20">
      {/* local helper CSS (line-clamp fallback if tailwind plugin missing) */}
      <style>{`
        .clamp-2 { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
        .clamp-3 { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-10">
          <h2
            className="font-fira-code font-semibold"
            style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)" }}
          >
            Featured{" "}
            <span
              style={{
                background: "linear-gradient(90deg,#7c3aed,#06b6d4)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Repositories
            </span>
          </h2>
          <p
            className="text-white/70 mt-3 max-w-2xl mx-auto"
            style={{ fontSize: "clamp(0.92rem,1.6vw,1rem)" }}
          >
            A curated selection of projects — production-ready apps, clean
            architecture and polished UI.
          </p>
        </div>

        {/* responsive grid with equal rows */}
        <div
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          style={{ gridAutoRows: "1fr" }}
        >
          {projects.map((item, idx) => {
            const tech = item?.techStack?.[0]?.name || "Tech";
            const color = colorGuess(tech) || "#6EE7B7";

            return (
              <motion.article
                key={item._id || idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.48,
                  delay: idx * 0.06,
                  ease: "easeOut",
                }}
                className="relative rounded-2xl overflow-hidden bg-white/3 backdrop-blur-md border border-white/8 shadow-sm"
                tabIndex={-1}
                aria-labelledby={`proj-${idx}-title`}
              >
                {/* Image area */}
                <Link
                  to={`/projects/${item?.slug}`}
                  className="block h-44 md:h-48 lg:h-52 w-full relative"
                >
                  <img
                    src={
                      item?.heroImage?.url ||
                      "/imgs/elementor-placeholder-image.png"
                    }
                    alt={item?.title || "Project image"}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out transform group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* tech chip */}
                  <div
                    className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium"
                    style={{ backgroundColor: `${color}40`, color: color }}
                  >
                    {tech}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4 flex flex-col gap-3 h-full">
                  <Link to={`/projects/${item?.slug}`} className="no-underline">
                    <h3
                      id={`proj-${idx}-title`}
                      className="text-lg font-semibold clamp-2"
                      style={{ lineHeight: 1.12 }}
                    >
                      {item?.title}
                    </h3>
                  </Link>

                  <p
                    className="text-sm text-white/70 clamp-3"
                    style={{ flex: "0 0 auto" }}
                  >
                    {item?.shortDesc}
                  </p>

                  {/* footer: links & stats */}
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <a
                        href={item?.liveDemo || "#"}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm text-white/80 hover:text-white/100 transition"
                        aria-label={`Open live demo of ${item?.title}`}
                      >
                        Live Demo
                      </a>
                      <span className="text-white/30">•</span>
                      <a
                        href={item?.repoLink || "#"}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-sm text-white/80 hover:text-white/100 transition"
                        aria-label={`Open repository of ${item?.title}`}
                      >
                        Repository
                      </a>
                    </div>

                    <Link
                      to={`/projects/${item?.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-sm text-white/90 hover:bg-white/8 transition"
                      aria-label={`Open project ${item?.title}`}
                    >
                      View
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 md:mt-12 text-center">
          <GardientButton text="See All Projects" link="/projects" />
        </div>
      </div>
    </section>
  );
}
