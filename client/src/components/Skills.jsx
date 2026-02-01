import React, { useRef, useMemo } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import SkillSkeleton from "./SkillSkeleton";

gsap.registerPlugin(ScrollTrigger);

/**
 * SkillsModern.jsx
 * - Drop-in replacement for your Skills section
 * - Preserves all Redux data (about, skills, experiences)
 * - Premium layout: left = intro/cards, right = visual panel
 * - GSAP-driven progress bars + counters (runs after data ready)
 * - Accessible: progressbar aria + keyboard-safe
 */

const SkillsModern = () => {
  const { data: about, isLoading } = useSelector((s) => s.about || {});
  const { skills = [], isLoading: isSkillLoading } = useSelector(
    (s) => s.skills || {},
  );
  const { experiences = [], isLoading: isExperienceLoading } = useSelector(
    (s) => s.experience || {},
  );

  const location = useLocation();
  const containerRef = useRef(null);

  const isPageLoading = isLoading || isSkillLoading || isExperienceLoading;

  const data = useMemo(
    () => ({
      name: about?.fullName || "Zain Abro",
      desc:
        about?.shortDesc ||
        "I'm a Full Stack Developer building fast, scalable and beautiful products.",
      skills,
      experiences,
    }),
    [about, skills, experiences],
  );

  // GSAP: animate each skill bar + numeric counter when in view
  useGSAP(
    () => {
      if (isPageLoading) return;

      const items = gsap.utils.toArray(".skill-item");

      items.forEach((el) => {
        const bar = el.querySelector(".progress-bar");
        const percentText = el.querySelector(".percent-text");
        const shimmer = el.querySelector(".bar-shimmer");
        if (!bar || !percentText) return;

        const target = parseInt(bar.dataset.percent, 10) || 0;
        const counter = { v: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });

        // bar fill
        tl.to(
          bar,
          { width: `${target}%`, duration: 1.1, ease: "power3.out" },
          0,
        );
        // counter animation
        tl.to(
          counter,
          {
            v: target,
            duration: 1.1,
            ease: "power3.out",
            onUpdate: () => {
              percentText.textContent = `${Math.round(counter.v)}%`;
              bar.setAttribute("aria-valuenow", Math.round(counter.v));
            },
          },
          0,
        );

        // subtle shimmer sweep for premium feel
        if (shimmer) {
          tl.fromTo(
            shimmer,
            { xPercent: -120, opacity: 0.6 },
            { xPercent: 120, opacity: 0, duration: 1.1, ease: "power3.out" },
            0,
          );
        }
      });
    },
    {
      scope: containerRef,
      dependencies: [isPageLoading, JSON.stringify(skills)],
    },
  );

  const variants = {
    container: { show: { transition: { staggerChildren: 0.14 } } },
    fadeUp: {
      hidden: { y: 28, opacity: 0 },
      show: { y: 0, opacity: 1, transition: { duration: 0.6 } },
    },
    fadeRight: {
      hidden: { x: 40, opacity: 0 },
      show: { x: 0, opacity: 1, transition: { duration: 0.6 } },
    },
  };

  // background uses a translucent gradient so the card reads distinct from page background
  const cardBackground = {
    background: `linear-gradient(135deg, rgba(0,209,243,0.08), rgba(6,12,18,0.55))`,
    border: `1px solid rgba(0,209,243,0.12)`,
    backdropFilter: `blur(6px)`,
  };

  if (isPageLoading) return <SkillSkeleton />;

  return (
    <motion.section
      ref={containerRef}
      key={location.pathname}
      variants={variants.container}
      initial="hidden"
      {...(location.pathname === "/"
        ? { whileInView: "show", viewport: { once: true, amount: 0.25 } }
        : { animate: "show" })}
      className="w-full bg-[#050617] text-white font-inter overflow-hidden px-6 py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT: Intro + experience */}
        <motion.div
          variants={variants.fadeUp}
          className="lg:col-span-5 space-y-6"
        >
          <div className="inline-flex items-center gap-3 rounded-full bg-white/3 px-4 py-2 text-xs font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-linear-to-r from-indigo-400 to-cyan-400" />
            Skills & Experience
          </div>

          <h2 className="sm:text-4xl xs:text-2xl font-semibold leading-tight">
            {data.name}
          </h2>

          <p className="text-white/70 max-w-xl leading-relaxed">{data.desc}</p>

          <div className="grid md:grid-cols-2 xs:grid-cols-1 gap-4 mt-4">
            {data.experiences.slice(0, 4).map((exp, i) => (
              <div key={i} style={cardBackground} className="rounded-2xl p-4">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="text-2xl">{exp.icon || "⚙️"}</div>
                  <div>
                    <div className="text-xl font-semibold">
                      {exp.title || exp.position || exp.name}
                    </div>
                    <div className="text-sm text-white/60 mt-1">
                      {exp.subTitle || exp.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT: Skill lists + visual */}
        <motion.div
          variants={variants.fadeRight}
          className="lg:col-span-7 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills column */}
            <div className="space-y-4">
              <h3 className="text-sm text-white/60 uppercase tracking-wider">
                Core Skills
              </h3>

              <div className="space-y-3">
                {data.skills
                  .slice(0, Math.ceil(data.skills.length / 2))
                  .map((s, idx) => (
                    <div
                      key={s._id || s.skillName + idx}
                      className="skill-item"
                      role="group"
                      aria-label={`${s.skillName} skill`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-white">
                          {s.skillName}
                        </div>
                        <div className="percent-text text-sm text-white/70">
                          0%
                        </div>
                      </div>

                      <div
                        className="relative w-full h-3 rounded-full bg-white/6 overflow-hidden"
                        aria-hidden
                      >
                        <div
                          className="progress-bar absolute left-0 top-0 h-full rounded-full bg-linear-to-r via-theme-cyan from-light-blue to-theme-purple"
                          data-percent={s.proficiency}
                          style={{ width: "0%" }}
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={0}
                        />

                        {/* shimmer */}
                        <div className="bar-shimmer absolute left-0 top-0 h-full w-1/3 opacity-0 pointer-events-none bg-white/20 blur-sm" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Skills column 2 */}
            <div className="space-y-4">
              <h3 className="text-sm text-white/60 uppercase tracking-wider">
                More Skills
              </h3>

              <div className="space-y-3">
                {data.skills
                  .slice(Math.ceil(data.skills.length / 2))
                  .map((s, idx) => (
                    <div
                      key={s._id || s.skillName + idx}
                      className="skill-item"
                      role="group"
                      aria-label={`${s.skillName} skill`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-white">
                          {s.skillName}
                        </div>
                        <div className="percent-text text-sm text-white/70">
                          0%
                        </div>
                      </div>

                      <div
                        className="relative w-full h-3 rounded-full bg-white/6 overflow-hidden"
                        aria-hidden
                      >
                        <div
                          className="progress-bar absolute left-0 top-0 h-full rounded-full bg-linear-to-r via-theme-cyan from-light-blue to-theme-purple"
                          data-percent={s.proficiency}
                          style={{ width: "0%" }}
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={0}
                        />

                        <div className="bar-shimmer absolute left-0 top-0 h-full w-1/3 opacity-0 pointer-events-none bg-white/20 blur-sm" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Visual / CTA panel */}
          <div style={cardBackground} className="rounded-2xl p-6 ">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white/60">Focused on</div>
                <h4 className="text-2xl font-semibold mt-1">
                  Performance · UX · Scalability
                </h4>
                <p className="text-white/70 mt-3 max-w-xl">
                  {about?.shortDesc}
                </p>
              </div>

              <div className="hidden md:flex flex-col items-center gap-3">
                <div className="rounded-full bg-linear-to-br from-cyan-400 to-indigo-500 p-4 shadow-lg">
                  <svg
                    width="56"
                    height="56"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M12 2v6l4-2"
                      stroke="#fff"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="#fff"
                      strokeWidth="1.2"
                      opacity="0.14"
                    />
                  </svg>
                </div>
                <a
                  href="/projects"
                  className="rounded-full bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/8 transition"
                >
                  See Projects
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default SkillsModern;
