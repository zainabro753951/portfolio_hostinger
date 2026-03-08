import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";

import CodeBlock from "./CodeBlock";
import AboutSkeleton from "./AboutSkeleton";
import { backendSkillFilter, frontendSkillFilter } from "../../../Utils/Utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AboutModern = () => {
  const { skills, isLoading: isSkillLoading } = useSelector((s) => s.skills);
  const { data: about, isLoading: isAboutLoading } = useSelector(
    (s) => s.about,
  );
  const { projects, isLoading: isProjectLoading } = useSelector(
    (s) => s.projects,
  );

  const isPageLoading = isSkillLoading || isAboutLoading || isProjectLoading;

  const skillNames = useMemo(
    () => skills?.map((i) => i.skillName) || [],
    [skills],
  );

  const DoneProjects = useMemo(
    () =>
      projects?.filter(
        (i) =>
          i.visibility?.toLowerCase() === "public" &&
          i.status?.toLowerCase() === "published",
      ).length || 0,
    [projects],
  );

  const frontendSkills = useMemo(
    () => frontendSkillFilter(skillNames) || [],
    [skillNames],
  );
  const backendSkills = useMemo(
    () => backendSkillFilter(skillNames) || [],
    [skillNames],
  );

  const experience = useMemo(
    () => [
      {
        key: "years",
        icon: "⚙️",
        title: about?.experienceYears || 5,
        suffix: "+",
        subTitle: "Years Coding",
      },
      {
        key: "projects",
        icon: "📁",
        title: DoneProjects,
        suffix: "+",
        subTitle: "Projects Done",
      },
      {
        key: "clients",
        icon: "👥",
        title: about?.happyClients || 135,
        suffix: "+",
        subTitle: "Happy Clients",
      },
      {
        key: "quality",
        icon: "✅",
        title: about?.codeQuality || 100,
        suffix: "%",
        subTitle: "Code Quality",
      },
    ],
    [DoneProjects, about],
  );

  const containerRef = useRef(null);
  const countersRef = useRef({});

  // GSAP counters - run after data available
  useGSAP(
    () => {
      if (isPageLoading) return;

      // kill previous ScrollTriggers in this scope
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === containerRef.current) st.kill();
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      experience.forEach((item, i) => {
        const el = countersRef.current[item.key];
        if (!el) return;

        const obj = { v: 0 };
        tl.to(
          obj,
          {
            v: item.title,
            duration: 1.4,
            delay: 0,
            ease: "power2.out",
            onUpdate: () => {
              el.innerText = Math.floor(obj.v).toLocaleString();
            },
            onComplete: () => {
              el.innerText = item.title.toLocaleString() + (item.suffix ?? "");
            },
          },
          i * 0.18,
        );
      });

      return () => {
        try {
          tl.kill();
        } catch (e) {}
      };
    },
    {
      scope: containerRef,
      dependencies: [isPageLoading, JSON.stringify(experience)],
    },
  );

  // Framer motion variants (simple, GPU safe)
  const animations = {
    container: { hidden: {}, show: { transition: { staggerChildren: 0.16 } } },
    fadeUp: {
      hidden: { y: 28, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.66, ease: "easeOut" },
      },
    },
  };

  const myCode = `class About {\n  name: "${about?.fullName || "Your Name"}",\n  role: "${about?.shortRole || "Short Role"}",\n  skills: {\n    frontend: [\n      ${frontendSkills?.map((s) => `"${s}"`).join(", ")}\n    ],\n    backend: [\n      ${backendSkills?.map((s) => `"${s}"`).join(", ")}\n    ]\n  }\n}`;

  if (isPageLoading) return <AboutSkeleton />;

  // background uses a translucent gradient so the card reads distinct from page background
  const cardBackground = {
    background: `linear-gradient(135deg, rgba(0,209,243,0.08), rgba(6,12,18,0.55))`,
    border: `1px solid rgba(0,209,243,0.12)`,
    backdropFilter: `blur(6px)`,
  };

  return (
    <motion.section
      ref={containerRef}
      variants={animations.container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className="relative w-full bg-[#050617] text-white overflow-hidden px-6 py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* LEFT: Stats + Skill tags */}
        <motion.div
          variants={animations.fadeUp}
          className="lg:col-span-5 space-y-6"
        >
          <div className="inline-flex items-center gap-3 rounded-full bg-white/3 px-4 py-2 text-xs font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-linear-to-r from-indigo-400 to-cyan-400" />
            About me
          </div>

          <h2 className="sm:text-4xl xs:text-2xl font-semibold leading-tight">
            {about?.shortRole || "Building meaningful products"}
          </h2>

          <p className="text-white/70 max-w-xl leading-relaxed">
            {about?.longDesc}
          </p>

          {/* Experience cards */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {experience.map((item) => (
              <div
                key={item.key}
                style={cardBackground}
                className="rounded-2xl p-4"
              >
                <div className="flex flex-wrap items-start gap-4">
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <div
                      className="text-2xl font-semibold"
                      ref={(el) => (countersRef.current[item.key] = el)}
                    >
                      0
                    </div>
                    <div className="text-sm text-white/60">{item.subTitle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Skills lists */}
          <div className="mt-6">
            <h3 className="text-sm text-white/60 mb-3">Frontend</h3>
            <div className="flex flex-wrap gap-2">
              {frontendSkills.map((s) => (
                <motion.span
                  key={s}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="rounded-full bg-white/5 px-3 py-1 text-sm text-white/80"
                >
                  {s}
                </motion.span>
              ))}
            </div>

            <h3 className="text-sm text-white/60 mt-6 mb-3">Backend</h3>
            <div className="flex flex-wrap gap-2">
              {backendSkills.map((s) => (
                <motion.span
                  key={s}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="rounded-full bg-white/5 px-3 py-1 text-sm text-white/80"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Code & highlight */}
        <motion.div
          variants={animations.fadeUp}
          className="lg:col-span-7 space-y-6 flex flex-col"
        >
          <div style={cardBackground} className="rounded-2xl  p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-400" />
                <div className="h-2 w-2 rounded-full bg-yellow-400" />
                <div className="h-2 w-2 rounded-full bg-green-400" />
              </div>

              <div className="text-sm text-white/60">{about?.fullName}</div>
            </div>

            <div className="mt-4">
              {/* Code block component (keeps your existing implementation) */}
              <CodeBlock code={myCode} language="js" showCopy />
            </div>
          </div>

          {/* Project highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Example project card - use first two public projects when available */}
            {projects
              ?.filter(
                (p) =>
                  p.visibility?.toLowerCase() === "public" &&
                  p.status?.toLowerCase() === "published",
              )
              .slice(0, 2)
              .map((p) => (
                <motion.a
                  key={p._id}
                  href={`/projects/${p._id}`}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-2xl bg-white/3 p-4 backdrop-blur border border-white/8"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">{p.title}</h4>
                      <p className="text-sm text-white/60 mt-2 line-clamp-2">
                        {p.shortDesc}
                      </p>
                    </div>
                    <div className="flex-shrink-0 self-center text-sm text-white/50">
                      {p.tech?.slice(0, 2).join(", ")}
                    </div>
                  </div>
                </motion.a>
              ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AboutModern;
