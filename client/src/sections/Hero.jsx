import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "motion/react";
import { ArrowDown, Sparkles } from "lucide-react";
import heroImage from "../assets/images/hero-portrait.jpg";
import HeroSkeleton from "./HeroSkeleton";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Hero = ({ about }) => {
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  const headingRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL_FOR_IMAGE;

  useGSAP(
    () => {
      if (!about) return;

      const chars = headingRef.current?.querySelectorAll(".char");

      if (chars?.length) {
        gsap.fromTo(
          chars,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.05,
            ease: "power4.out",
            delay: 0.3,
          },
        );
      }

      gsap.fromTo(
        ".subheading",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.6 },
      );

      gsap.fromTo(
        imageRef.current,
        { rotateY: 90, opacity: 0, scale: 0.8 },
        {
          rotateY: 0,
          opacity: 1,
          scale: 1,
          duration: 1.5,
          delay: 0.4,
          ease: "power3.out",
        },
      );

      gsap.to(".gradient-orb", {
        scale: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".particle", {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        ease: "sine.inOut",
      });
    },
    {
      scope: heroRef, // 🔥 VERY IMPORTANT
      dependencies: [about], // run when data arrives
    },
  );

  const highlightText = (text) => {
    if (!text) return null;

    const keywords = [
      { word: "Developer", className: "text-neon-blue" },
      { word: "Designer", className: "text-neon-purple" },
    ];

    let parts = [text];

    keywords.forEach(({ word, className }) => {
      parts = parts.flatMap((part, index) =>
        typeof part === "string"
          ? part.split(new RegExp(`(${word})`, "gi")).map((chunk, idx) =>
              chunk.toLowerCase() === word.toLowerCase() ? (
                <span key={idx + index} className={className}>
                  {chunk}
                </span>
              ) : (
                chunk
              ),
            )
          : part,
      );
    });

    return parts;
  };

  // Mouse move effect for image tilt
  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

    gsap.to(imageRef.current, {
      rotateY: x * 15,
      rotateX: -y * 15,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!imageRef.current) return;
    gsap.to(imageRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const headingText = `HI, I'M ${about?.fullName?.split(" ")[0].toUpperCase()}`;

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh"
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="gradient-orb absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/30 rounded-full blur-[100px]" />
        <div className="gradient-orb absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/30 rounded-full blur-[100px]" />
        <div className="gradient-orb absolute top-1/2 left-1/2 w-64 h-64 bg-neon-cyan/20 rounded-full blur-[80px]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-neon-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div ref={textRef} className="text-center lg:text-left z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            >
              <Sparkles size={16} className="text-neon-cyan" />
              <span className="text-sm text-gray-300">
                {about?.successNote}
              </span>
            </motion.div>

            {/* Heading */}
            <h1
              ref={headingRef}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-bold mb-6 overflow-hidden"
            >
              {headingText.split("").map((char, index) => (
                <span
                  key={index}
                  className="char inline-block"
                  style={{
                    color:
                      char === " "
                        ? "transparent"
                        : index > 6
                          ? "#00d4ff"
                          : "#ffffff",
                    textShadow:
                      index > 6 ? "0 0 30px rgba(0, 212, 255, 0.5)" : "none",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h1>

            {/* Subheading */}
            <p className="subheading text-xl sm:text-2xl text-gray-400 mb-4 font-light">
              {highlightText(about?.shortRole)}
            </p>

            {/* Description */}
            <p className="subheading text-gray-500 max-w-lg mx-auto lg:mx-0 mb-10">
              {about?.shortDesc
                ? about?.shortDesc
                : "I craft digital experiences that merge art with functionality.Specializing in modern web development and stunning UI/UX design."}
            </p>

            {/* CTA Buttons */}
            <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Explore My Work
                  <ArrowDown
                    size={18}
                    className="group-hover:translate-y-1 transition-transform"
                  />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-cyan"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full glass text-white font-semibold border border-white/10 hover:border-neon-cyan/50 transition-colors"
              >
                Contact Me
              </motion.button>
            </div>

            {/* Stats */}
            <div className="cta-buttons flex gap-8 mt-12 justify-center lg:justify-start">
              {[
                { value: about?.experience, label: "Years Experience" },
                { value: "50+", label: "Projects Completed" },
                { value: "30+", label: "Happy Clients" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-display font-bold text-neon-cyan">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div
            className="relative z-10 perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div
              ref={imageRef}
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan rounded-3xl opacity-30 blur-2xl" />

              {/* Image Container */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10">
                <img
                  src={
                    about?.aboutImage?.url
                      ? `${backendUrl}${about?.aboutImage?.url}`
                      : heroImage
                  }
                  alt="Hero Portrait"
                  className="w-full h-auto object-cover"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-void/50 to-transparent" />
              </div>

              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute -left-8 bottom-20 glass rounded-2xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">Expert</div>
                    <div className="text-gray-400 text-sm">UI/UX Designer</div>
                  </div>
                </div>
              </motion.div>

              {/* Another Floating Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="absolute -right-4 top-20 glass rounded-2xl p-4 border border-white/10"
              >
                <div className="text-center">
                  <div className="text-3xl font-display font-bold text-neon-purple">
                    100%
                  </div>
                  <div className="text-gray-400 text-sm">Satisfaction</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-void to-transparent" />
    </section>
  );
};

export default Hero;
