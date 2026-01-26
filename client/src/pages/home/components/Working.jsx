import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useSelector } from "react-redux";
import { useGetServiceIcon } from "../../../Utils/GetServiceIcon";
import ServiceSkeleton from "../../../components/ServiceSkeleton";

/**
 * WorkingModernResponsiveV2.jsx
 * - Equal-height cards
 * - Title & description clamping (line-clamp CSS)
 * - Read more toggle to reveal full text (prevents overflow)
 * - GPU-safe hover/focus (transform only)
 * - Accessible: aria-expanded, focus-visible
 */

export default function WorkingModernResponsiveV2() {
  const prefersReducedMotion = useReducedMotion();
  const { services = [], isLoading } = useSelector((s) => s.service || {});
  const [isPageReady, setIsPageReady] = useState(false);

  // Which card is expanded (to show full description). null => none.
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      const t = setTimeout(() => setIsPageReady(true), 120);
      return () => clearTimeout(t);
    }
  }, [isLoading]);

  // helper from your utils - treated as a pure mapper (call at top-level)
  // const getIcon = useGetServiceIcon;

  // // Build cards from services (keeps icons via your mapping function)
  // const cards = useMemo(() => {
  //   return (services || []).map((item) => ({
  //     id: item._id || item.title,
  //     icon: getIcon ? getIcon(item.title) : "🔧",
  //     title: item.title,
  //     desc: item.shortDesc || "",
  //     href:
  //       item.link || `/services/${item._id || encodeURIComponent(item.title)}`,
  //   }));
  // }, [services, getIcon]);

  // if (isLoading && !isPageReady) return <ServiceSkeleton />;

  // if (isPageReady && cards.length === 0) {
  //   return (
  //     <section className="w-full py-20 text-center text-white/70">
  //       <p>No services found.</p>
  //     </section>
  //   );
  // }

  const cards = [
    {
      id: "65a12345",
      icon: "💻", // Real code mein yahan Icon component hoga (jo hook se return hoga)
      title: "Web Development",
      desc: "Hum high-performance aur responsive websites banate hain.",
      href: "/services/65a12345",
    },
    {
      id: "65b67890",
      icon: "📱",
      title: "App Development",
      desc: "Android aur iOS ke liye custom mobile applications.",
      href: "/services/app-development", // Agar ID na ho to title encode hoke ayega
    },
    {
      id: "65c11223",
      icon: "🎨",
      title: "UI/UX Design",
      desc: "User-friendly interfaces aur behtareen user experience designs.",
      href: "https://external-link.com/design", // Agar 'link' property moujood ho
    },
    {
      id: "65d44556",
      icon: "📈",
      title: "Digital Marketing",
      desc: "SEO aur Social Media ke zariye apne business ko grow karein.",
      href: "/services/digital-marketing",
    },
  ];

  // Toggle read more
  const toggleExpand = (id) => {
    setExpandedId((curr) => (curr === id ? null : id));
  };

  return (
    <section className="bg-[#050617] text-white font-inter py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold">
            How{" "}
            <span className="bg-linear-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              I can help
            </span>
          </h2>
          <p className="mt-3 text-white/70 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
            Tailored services from idea → product. I focus on performance, UX &
            maintainability.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <motion.a
              key={c.id}
              href={c.href}
              className="group relative flex flex-col rounded-2xl p-6 sm:p-5 md:p-6 bg-white/5 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-transform duration-300 transform hover:-translate-y-2 hover:scale-101"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
            >
              {/* Card content flex grow */}
              <div className="flex flex-col h-full">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="shrink-0 w-14 h-14 rounded-xl bg-linear-to-br from-indigo-500/20 to-cyan-400/10 flex items-center justify-center text-2xl">
                    {c.icon}
                  </div>

                  {/* Title & description */}
                  <div className="flex-1 flex flex-col">
                    <h3
                      className="font-semibold text-base sm:text-lg md:text-xl line-clamp-2"
                      title={c.title}
                    >
                      {c.title}
                    </h3>
                    <p
                      className={`mt-2 text-white/70 text-sm sm:text-base md:text-sm line-clamp-3`}
                    >
                      {c.desc}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs sm:text-sm text-white/80">
                    Learn more
                  </span>
                  <span className="text-xs text-white/50">•</span>
                  <span className="text-xs text-white/50">Custom plan</span>
                </div>
              </div>

              {/* Hover glow */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl"
                initial={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
                whileHover={{ boxShadow: "0 20px 60px rgba(124,58,237,0.1)" }}
                transition={{ duration: 0.4 }}
                style={{ zIndex: -1 }}
              />
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="/contact"
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-6 py-3 font-medium shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Get a custom quote
          </a>
        </div>
      </div>
    </section>
  );
}
