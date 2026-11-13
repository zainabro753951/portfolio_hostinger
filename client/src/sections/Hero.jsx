import heroImage from "@/assets/images/hero-portrait.jpg";
import LazyImage from "@/components/LazyImage";
import {
  FloatingCard,
  HeroBadge,
  HeroHeading,
  HeroStats,
  OutlineButton,
  PrimaryButton,
  THEME,
} from "@/components/UI";
import { fadeUp, useMotionPrefs } from "@/lib/motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { memo, useCallback, useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getClientSatisfactionRate } from "../Utils/Utils";

const hasValue = (v) =>
  v !== undefined && v !== null && v !== "" && String(v) !== "0";

/* ═══════════════════════════════════════════════════════════════════ */
/* 🖼️ PORTRAIT (single image for all screens — no duplicate download)  */
/* ═══════════════════════════════════════════════════════════════════ */
export const HeroImageSection = memo(({ imageUrl, about, satisfaction }) => {
  const { reduced, isMobile } = useMotionPrefs();
  const canTilt = !reduced && !isMobile;

  const rotateX = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });

  const handlePointerMove = useCallback(
    (e) => {
      if (!canTilt || e.pointerType !== "mouse") return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotateY.set(x * 10);
      rotateX.set(-y * 10);
    },
    [canTilt, rotateX, rotateY],
  );
  const handlePointerLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : isMobile ? 12 : 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0.01 : 0.8,
        delay: reduced ? 0 : 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto w-full max-w-[11rem] sm:max-w-[16rem] md:max-w-xs lg:max-w-none"
    >
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="relative"
      >
        {/* Single soft glow (no blur filter) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(closest-side,rgb(var(--brand-cyan)/0.18),rgb(var(--brand-purple)/0.10)_60%,transparent)]"
        />

        <div className="relative overflow-hidden rounded-2xl border border-line-strong shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
          <LazyImage
            src={imageUrl}
            alt={`${about?.fullName || "Developer"} - Professional Portrait`}
            fallback={heroImage}
            eager={true}
            crossOrigin={false}
            className="aspect-[4/4] w-full bg-cover"
            objectFit="cover"
            objectPosition="bottom"
            placeholderColor={THEME.bg}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-base/50 to-transparent"
          />
        </div>

        {/* Floating cards — desktop only; real data only */}
        {(about?.shortRole || hasValue(about?.experience)) && (
          <div className="hidden lg:block">
            <FloatingCard
              delay={1.0}
              position="left"
              label="Role and experience"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan">
                  <Sparkles size={20} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-ink sm:text-base">
                    {about?.shortRole || "Developer"}
                  </div>
                  {hasValue(about?.experience) && (
                    <div className="text-xs text-ink-secondary sm:text-sm">
                      {about.experience}+ years experience
                    </div>
                  )}
                </div>
              </div>
            </FloatingCard>
          </div>
        )}

        {satisfaction !== null && (
          <div className="hidden lg:block">
            <FloatingCard
              delay={1.2}
              position="right"
              label="Client satisfaction rate"
            >
              <div className="text-center">
                <div className="mb-0.5 text-2xl font-bold text-brand-purple sm:text-3xl">
                  {satisfaction}%
                </div>
                <div className="text-xs text-ink-secondary sm:text-sm">
                  Satisfaction
                </div>
              </div>
            </FloatingCard>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
});
HeroImageSection.displayName = "HeroImageSection";

/* ═══════════════════════════════════════════════════════════════════ */
/* 🦸 HERO                                                             */
/* ═══════════════════════════════════════════════════════════════════ */
const Hero = memo(({ about }) => {
  console.log(about);

  const { reduced, isMobile } = useMotionPrefs();
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;
  const { testimonials } = useSelector(
    (state) => state.testimonial,
    shallowEqual,
  );

  // getClientSatisfactionRate divides by length → NaN when there are no testimonials
  const satisfaction = useMemo(() => {
    if (!testimonials?.length) return null;
    const rate = getClientSatisfactionRate(testimonials);
    return Number.isFinite(rate) ? rate : null;
  }, [testimonials]);

  const imageUrl = useMemo(() => {
    if (!about?.aboutImage?.url) return null;

    const url = about.aboutImage.url.trim();

    if (/^https?:\/\//i.test(url)) return url;

    if (backendUrl) {
      return `${backendUrl.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
    }
    return url;
  }, [about?.aboutImage?.url, backendUrl]);

  console.log(imageUrl);

  const structuredData = useMemo(() => {
    if (!about) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Person",
      name: about.fullName || "Developer",
      jobTitle: about.shortRole || "Full Stack Developer",
      description:
        about.shortDesc ||
        "Full Stack Developer specializing in modern web development and UI/UX design.",
      image: imageUrl || undefined,
      knowsAbout: ["Web Development", "UI/UX Design", "Full Stack Development"],
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };
  }, [about, imageUrl]);

  const headingText = useMemo(() => {
    const firstName =
      about?.fullName?.split(" ")[0]?.toUpperCase() || "DEVELOPER";
    return `HI, I'M ${firstName}`;
  }, [about?.fullName]);

  // Real values only — the old DEFAULT_STATS ('5', '5+', '5') were invented numbers.
  const stats = useMemo(
    () =>
      [
        { value: about?.experience, label: "Years Experience" },
        {
          value: about?.projectCounts?.publishedProjects,
          label: "Projects Completed",
        },
        { value: testimonials?.length, label: "Happy Clients" },
      ].filter((s) => hasValue(s.value)),
    [
      about?.experience,
      about?.projectCounts?.publishedProjects,
      testimonials?.length,
    ],
  );

  const prefs = useMemo(() => ({ reduced, isMobile }), [reduced, isMobile]);
  const roleV = useMemo(() => fadeUp(prefs, 0.4), [prefs]);
  const descV = useMemo(() => fadeUp(prefs, 0.5), [prefs]);
  const ctaV = useMemo(() => fadeUp(prefs, 0.6), [prefs]);
  const statsV = useMemo(() => fadeUp(prefs, 0.7), [prefs]);

  const role = about?.shortRole || "Full Stack Developer";

  return (
    <div className="relative isolate overflow-clip">
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      {/* Background: one soft cyan/blue glow top-left, purple depth bottom-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_20%_0%,rgb(var(--brand-blue)/0.12),transparent),radial-gradient(40%_50%_at_90%_90%,rgb(var(--brand-purple)/0.10),transparent)]"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:min-h-svh lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-28 lg:pt-36">
        {/* Text */}
        <div className="order-2 w-full text-center lg:order-1 lg:text-left">
          <HeroBadge successNote={about?.successNote} />

          <HeroHeading headingText={headingText} />

          <motion.p
            variants={roleV}
            initial="hidden"
            animate="visible"
            className="mb-3 text-lg font-light text-ink-secondary sm:mb-4 sm:text-xl md:text-2xl"
          >
            {role}
          </motion.p>

          <motion.p
            variants={descV}
            initial="hidden"
            animate="visible"
            className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-ink-secondary sm:mb-10 lg:mx-0"
          >
            {about?.shortDesc ||
              "I craft digital experiences that merge art with functionality. Specializing in modern web development and stunning UI/UX design."}
          </motion.p>

          <motion.div
            variants={ctaV}
            initial="hidden"
            animate="visible"
            className="mb-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4 lg:mb-12 lg:justify-start"
          >
            <PrimaryButton
              to="/projects"
              icon={ArrowRight}
              className="w-full sm:w-auto"
            >
              Explore My Work
            </PrimaryButton>
            <OutlineButton to="/contact" className="w-full sm:w-auto">
              Contact Me
            </OutlineButton>
          </motion.div>

          {stats.length > 0 && (
            <motion.div variants={statsV} initial="hidden" animate="visible">
              <HeroStats stats={stats} />
            </motion.div>
          )}
        </div>

        {/* Portrait — compact on mobile, full on desktop */}
        <div className="order-1 lg:order-2">
          <HeroImageSection
            imageUrl={imageUrl}
            about={about}
            satisfaction={satisfaction}
          />
        </div>
      </div>

      {/* Fade into next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-base to-transparent sm:h-28"
      />
    </div>
  );
});

Hero.displayName = "Hero";
export default Hero;
