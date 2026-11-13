import { ServiceCard } from "@/components/UI";
import useCreatedAtSorted from "@/hooks/useCreatedAtSorted";
import sortServicesByCreatedAt from "@/hooks/sortServicesByCreatedAt";
import {
  fadeUp,
  staggerParent,
  useMotionPrefs,
  VIEWPORT_ONCE,
} from "@/lib/motion";
import { motion } from "motion/react";
import { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const INITIAL_SERVICES = 6;

const ServiceSkeletonCard = () => (
  <div
    aria-hidden="true"
    className="relative min-h-[300px] overflow-hidden rounded-2xl border border-line-subtle bg-surface-card p-6"
  >
    <div className="absolute inset-0 service-shimmer pointer-events-none" />
    <div className="relative z-10 mt-auto space-y-4 pt-32">
      <div className="h-6 w-3/4 rounded-lg bg-surface-soft" />
      <div className="h-4 w-full rounded-md bg-surface-soft/70" />
      <div className="h-4 w-2/3 rounded-md bg-surface-soft/70" />
    </div>
  </div>
);

const ServicesSection = memo(() => {
  const { services: sr, isLoading } = useSelector((state) => state.service);

  const sortedServices = useMemo(() => sortServicesByCreatedAt(sr), [sr]);

  const [showAll, setShowAll] = useState(false);

  const { reduced, isMobile } = useMotionPrefs();

  const prefs = useMemo(() => ({ reduced, isMobile }), [reduced, isMobile]);

  // const parentVariants = useMemo(() => staggerParent(0.08, 0.05), []);

  const itemVariants = useMemo(() => fadeUp(prefs, 0), [prefs]);

  // Display only six services initially.
  const visibleServices = useMemo(() => {
    if (!sortedServices?.length) return [];

    return showAll ? sortedServices : sortedServices.slice(0, INITIAL_SERVICES);
  }, [sortedServices, showAll]);

  const hasMoreServices = (sortedServices?.length || 0) > INITIAL_SERVICES;

  // SEO: Generate structured service data from backend records.
  const structuredData = useMemo(() => {
    if (!sortedServices?.length || typeof window === "undefined") {
      return null;
    }

    return {
      "@context": "https://schema.org",
      "@graph": sortedServices.map((service) => ({
        "@type": "Service",
        name: service.title || "Professional Web Development Service",
        description:
          service.description ||
          "Professional web development and digital solutions.",
        url: service.slug
          ? `${window.location.origin}/services/${encodeURIComponent(service.slug)}`
          : `${window.location.origin}/services`,
        provider: {
          "@type": "Person",
          name: "Zain Abro",
          url: "https://zaincode.io/",
        },
      })),
    };
  }, [sortedServices]);

  const handleToggleServices = () => {
    setShowAll((previous) => !previous);
  };

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative isolate overflow-hidden py-20 sm:py-24 lg:py-28"
    >
      {/* SEO structured data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      )}

      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-1/2 top-20 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand-cyan/[0.055] blur-[120px]" />
        <div className="absolute -right-40 top-[45%] h-72 w-72 rounded-full bg-brand-purple/[0.045] blur-[100px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16 lg:mb-20">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="mb-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/20 bg-brand-cyan/[0.07] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-cyan sm:text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-cyan opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-cyan" />
              </span>
              What I Offer
            </span>
          </motion.div>

          <motion.h2
            id="services-heading"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="mb-5 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            Digital Solutions,
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple bg-clip-text text-transparent">
              Built to Make an Impact.
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            className="mx-auto max-w-2xl text-sm leading-7 text-ink-secondary sm:text-base sm:leading-8"
          >
            From powerful web applications to scalable digital experiences, I
            build solutions that help businesses grow, perform, and stand out.
          </motion.p>

          {/* Service count */}
          {!isLoading && sortedServices?.length > 0 && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              className="mt-7 inline-flex items-center gap-2 text-xs font-medium text-ink-secondary"
            >
              <span className="h-px w-7 bg-line-subtle" />
              {sortedServices.length} Professional Services
              <span className="h-px w-7 bg-line-subtle" />
            </motion.div>
          )}
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {Array.from({ length: INITIAL_SERVICES }).map((_, index) => (
              <ServiceSkeletonCard key={`service-skeleton-${index}`} />
            ))}
          </div>
        ) : visibleServices.length > 0 ? (
          <>
            <motion.div
              id="services-grid"
              layout={!reduced}
              className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
            >
              {visibleServices.map((service, index) => (
                <motion.div
                  key={service.id || service.slug || `service-${index}`}
                  initial={{
                    opacity: 0,
                    y: reduced ? 0 : 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: reduced ? 0.01 : 0.45,
                    delay: reduced ? 0 : Math.min(index, 5) * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  layout={!reduced}
                  className="group relative h-full min-w-0"
                >
                  {/* Subtle hover glow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-brand-cyan/20 via-transparent to-brand-purple/20 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <div className="relative h-full">
                    <ServiceCard service={service} index={index} />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* View More / Show Less */}
            {hasMoreServices && (
              <div className="mt-12 flex flex-col items-center sm:mt-16">
                <motion.button
                  type="button"
                  onClick={handleToggleServices}
                  aria-expanded={showAll}
                  aria-controls="services-grid"
                  whileHover={reduced ? undefined : { y: -3, scale: 1.02 }}
                  whileTap={reduced ? undefined : { scale: 0.97 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className="group relative inline-flex min-h-14 items-center justify-center gap-3 overflow-hidden rounded-2xl border border-brand-cyan/30 bg-surface-card px-7 py-4 text-sm font-bold text-ink shadow-[0_8px_30px_rgba(2,211,254,0.06)] transition-all duration-300 hover:border-brand-cyan/70 hover:shadow-[0_10px_40px_rgba(2,211,254,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-4 focus-visible:ring-offset-surface-card"
                >
                  {/* Button gradient */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-r from-brand-cyan/[0.08] via-brand-blue/[0.06] to-brand-purple/[0.08] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <span className="relative">
                    {showAll ? "Show Less" : "View All Services"}
                  </span>

                  <span
                    aria-hidden="true"
                    className={`relative flex h-7 w-7 items-center justify-center rounded-lg border border-brand-cyan/20 bg-brand-cyan/10 text-brand-cyan transition-transform duration-300 ${
                      showAll ? "rotate-180" : "group-hover:translate-y-0.5"
                    }`}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </motion.button>

                <p className="mt-4 text-xs text-ink-secondary">
                  {showAll
                    ? `Showing all ${sortedServices.length} services`
                    : `${sortedServices.length - INITIAL_SERVICES} more services available`}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-3xl border border-line-subtle bg-surface-card/50 px-6 py-16 text-center">
            <p className="text-sm text-ink-secondary">
              Services will be listed here soon.
            </p>
          </div>
        )}
      </div>

      {/* Skeleton animation */}
      <style>{`
        @keyframes service-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .service-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.045) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: service-shimmer 1.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .service-shimmer {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
});

ServicesSection.displayName = "ServicesSection";

export default ServicesSection;
