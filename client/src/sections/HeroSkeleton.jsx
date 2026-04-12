import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "motion/react";
import { Sparkles, ArrowDown } from "lucide-react";

const HeroSkeleton = () => {
  const skeletonRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Shimmer effect for all skeleton elements
      gsap.to(".skeleton-shimmer", {
        backgroundPosition: "200% 0",
        duration: 1.5,
        repeat: -1,
        ease: "linear",
      });

      // Pulsing glow animation
      gsap.to(".skeleton-glow", {
        opacity: 0.4,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3,
      });

      // Floating particles animation
      gsap.to(".skeleton-particle", {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        ease: "sine.inOut",
      });

      // Image container breathing effect
      gsap.to(imageRef.current, {
        scale: 1.02,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Text lines stagger animation
      gsap.fromTo(
        ".skeleton-text-line",
        { x: -20, opacity: 0.3 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        },
      );

      // Gradient orb animation
      gsap.to(".skeleton-orb", {
        scale: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, skeletonRef);

    return () => ctx.revert();
  }, []);

  // Shimmer gradient style
  const shimmerStyle = {
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)",
    backgroundSize: "200% 100%",
  };

  return (
    <section
      ref={skeletonRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh"
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="skeleton-orb skeleton-glow absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[100px]" />
        <div className="skeleton-orb skeleton-glow absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px]" />
        <div className="skeleton-orb skeleton-glow absolute top-1/2 left-1/2 w-64 h-64 bg-neon-cyan/15 rounded-full blur-[80px]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="skeleton-particle absolute w-1 h-1 bg-neon-cyan/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content Skeleton */}
          <div
            ref={textRef}
            className="text-center lg:text-left z-10 space-y-6"
          >
            {/* Badge Skeleton */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 skeleton-shimmer skeleton-glow">
              <Sparkles size={16} className="text-neon-cyan/50" />
              <div
                className="h-4 w-32 rounded-full"
                style={{
                  ...shimmerStyle,
                  backgroundColor: "rgba(255,255,255,0.05)",
                }}
              />
            </div>

            {/* Heading Skeleton */}
            <div className="space-y-2 mb-6 overflow-hidden">
              <div
                className="skeleton-text-line skeleton-shimmer h-16 sm:h-20 lg:h-24 xl:h-28 rounded-lg"
                style={{
                  ...shimmerStyle,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  width: "80%",
                }}
              />
              <div
                className="skeleton-text-line skeleton-shimmer h-16 sm:h-20 lg:h-24 xl:h-28 rounded-lg"
                style={{
                  ...shimmerStyle,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  width: "60%",
                }}
              />
            </div>

            {/* Subheading Skeleton */}
            <div
              className="skeleton-text-line skeleton-shimmer h-6 sm:h-8 rounded-full mx-auto lg:mx-0"
              style={{
                ...shimmerStyle,
                backgroundColor: "rgba(255,255,255,0.05)",
                width: "70%",
              }}
            />

            {/* Description Skeleton */}
            <div className="space-y-3 max-w-lg mx-auto lg:mx-0 mb-10">
              <div
                className="skeleton-text-line skeleton-shimmer h-4 rounded-full"
                style={{
                  ...shimmerStyle,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  width: "100%",
                }}
              />
              <div
                className="skeleton-text-line skeleton-shimmer h-4 rounded-full"
                style={{
                  ...shimmerStyle,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  width: "90%",
                }}
              />
              <div
                className="skeleton-text-line skeleton-shimmer h-4 rounded-full"
                style={{
                  ...shimmerStyle,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  width: "80%",
                }}
              />
            </div>

            {/* CTA Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <div
                className="skeleton-shimmer skeleton-glow h-14 w-48 rounded-full"
                style={{
                  ...shimmerStyle,
                  backgroundColor: "rgba(0,212,255,0.1)",
                  border: "1px solid rgba(0,212,255,0.2)",
                }}
              />
              <div
                className="skeleton-shimmer h-14 w-40 rounded-full glass border border-white/10"
                style={{
                  ...shimmerStyle,
                  backgroundColor: "rgba(255,255,255,0.03)",
                }}
              />
            </div>

            {/* Stats Skeleton */}
            <div className="flex gap-8 justify-center lg:justify-start">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="text-center space-y-2">
                  <div
                    className="skeleton-shimmer skeleton-glow h-8 sm:h-10 w-16 rounded-lg mx-auto"
                    style={{
                      ...shimmerStyle,
                      backgroundColor: "rgba(0,212,255,0.1)",
                    }}
                  />
                  <div
                    className="skeleton-shimmer h-3 w-20 rounded-full mx-auto"
                    style={{
                      ...shimmerStyle,
                      backgroundColor: "rgba(255,255,255,0.03)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Image Skeleton */}
          <div className="relative z-10 perspective-1000">
            <div
              ref={imageRef}
              className="relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-cyan/20 rounded-3xl opacity-50 blur-2xl skeleton-glow" />

              {/* Image Container Skeleton */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[4/5] bg-dark-void/50">
                <div
                  className="absolute inset-0 skeleton-shimmer"
                  style={{
                    ...shimmerStyle,
                    backgroundColor: "rgba(255,255,255,0.03)",
                  }}
                />

                {/* Animated scan line */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/10 to-transparent"
                  animate={{ top: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ height: "50%" }}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-void/50 to-transparent" />
              </div>

              {/* Floating Card Skeleton 1 */}
              <div className="absolute -left-8 bottom-20 glass rounded-2xl p-4 border border-white/10 skeleton-shimmer skeleton-glow">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full skeleton-shimmer"
                    style={{
                      ...shimmerStyle,
                      backgroundColor: "rgba(0,212,255,0.15)",
                    }}
                  />
                  <div className="space-y-2">
                    <div
                      className="h-4 w-20 rounded-full"
                      style={{
                        ...shimmerStyle,
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                    />
                    <div
                      className="h-3 w-24 rounded-full"
                      style={{
                        ...shimmerStyle,
                        backgroundColor: "rgba(255,255,255,0.03)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Floating Card Skeleton 2 */}
              <div className="absolute -right-4 top-20 glass rounded-2xl p-4 border border-white/10 skeleton-shimmer skeleton-glow text-center">
                <div
                  className="h-8 w-16 rounded-lg mx-auto mb-1"
                  style={{
                    ...shimmerStyle,
                    backgroundColor: "rgba(168,85,247,0.15)",
                  }}
                />
                <div
                  className="h-3 w-20 rounded-full mx-auto"
                  style={{
                    ...shimmerStyle,
                    backgroundColor: "rgba(255,255,255,0.03)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-neon-cyan"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500 tracking-widest uppercase">
          Loading Experience
        </span>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-void to-transparent" />
    </section>
  );
};

export default HeroSkeleton;
