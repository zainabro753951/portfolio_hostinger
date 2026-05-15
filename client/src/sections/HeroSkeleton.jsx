import { gsap } from 'gsap';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { THEME } from '@/components/UI';

const HeroSkeleton = () => {
  const skeletonRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Shimmer effect for all skeleton elements
      gsap.to('.skeleton-shimmer', {
        backgroundPosition: '200% 0',
        duration: 1.5,
        repeat: -1,
        ease: 'linear',
      });

      // Pulsing glow animation
      gsap.to('.skeleton-glow', {
        opacity: [0.1, 0.35, 0.1],
        duration: 2,
        repeat: -1,
        ease: 'sine.inOut',
        stagger: 0.3,
      });

      // Floating particles animation
      gsap.to('.skeleton-particle', {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        ease: 'sine.inOut',
      });

      // Image container breathing effect
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          scale: 1.02,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Text lines stagger animation
      gsap.fromTo(
        '.skeleton-text-line',
        { x: -10, opacity: 0.4 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
        }
      );

      // Gradient orb animation
      gsap.to('.skeleton-orb', {
        scale: 1.15,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, skeletonRef);

    return () => ctx.revert();
  }, []);

  const shimmerStyle = {
    background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%)',
    backgroundSize: '200% 100%',
  };

  const glassStyle = {
    background: THEME.bgCard,
    backdropFilter: 'blur(10px)',
    border: `1px solid ${THEME.border}`,
  };

  return (
    <section
      ref={skeletonRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: THEME.bg }}
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="skeleton-orb skeleton-glow absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px]" style={{ background: 'rgba(2, 211, 254, 0.12)' }} />
        <div className="skeleton-orb skeleton-glow absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px]" style={{ background: 'rgba(78, 144, 225, 0.12)' }} />
        <div className="skeleton-orb skeleton-glow absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-[100px]" style={{ background: 'rgba(154, 92, 183, 0.1)' }} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="skeleton-particle absolute w-1 h-1 rounded-full"
            style={{
              left: `${(i * 5.3) % 100}%`,
              top: `${(i * 11.7) % 100}%`,
              background: i % 3 === 0 ? 'rgba(2, 211, 254, 0.3)' : i % 3 === 1 ? 'rgba(78, 144, 225, 0.3)' : 'rgba(154, 92, 183, 0.3)',
              opacity: 0.2 + (i % 3) * 0.15,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content Skeleton */}
          <div className="text-center lg:text-left z-10 space-y-6">
            {/* Badge Skeleton */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 skeleton-shimmer skeleton-glow" style={{ ...glassStyle, ...shimmerStyle }}>
              <Sparkles size={16} style={{ color: 'rgba(2, 211, 254, 0.5)' }} />
              <div className="h-4 w-32 rounded-full" style={{ ...shimmerStyle, backgroundColor: 'rgba(255,255,255,0.05)' }} />
            </div>

            {/* Heading Skeleton */}
            <div className="space-y-3 mb-6 overflow-hidden">
              <div className="skeleton-text-line skeleton-shimmer h-16 sm:h-20 lg:h-24 xl:h-28 rounded-xl" style={{ ...shimmerStyle, backgroundColor: 'rgba(255,255,255,0.08)', width: '85%' }} />
              <div className="skeleton-text-line skeleton-shimmer h-16 sm:h-20 lg:h-24 xl:h-28 rounded-xl" style={{ ...shimmerStyle, backgroundColor: 'rgba(255,255,255,0.08)', width: '65%' }} />
            </div>

            {/* Subheading Skeleton */}
            <div className="skeleton-text-line skeleton-shimmer h-6 sm:h-8 rounded-full mx-auto lg:mx-0" style={{ ...shimmerStyle, backgroundColor: 'rgba(255,255,255,0.05)', width: '75%' }} />

            {/* Description Skeleton */}
            <div className="space-y-3 max-w-lg mx-auto lg:mx-0 mb-10">
              {[100, 90, 75].map((w, i) => (
                <div key={i} className="skeleton-text-line skeleton-shimmer h-4 rounded-full" style={{ ...shimmerStyle, backgroundColor: 'rgba(255,255,255,0.04)', width: `${w}%` }} />
              ))}
            </div>

            {/* CTA Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <div className="skeleton-shimmer skeleton-glow h-14 w-48 rounded-full" style={{ ...shimmerStyle, backgroundColor: 'rgba(2, 211, 254, 0.1)', border: '1px solid rgba(2, 211, 254, 0.2)' }} />
              <div className="skeleton-shimmer h-14 w-40 rounded-full" style={{ ...glassStyle, ...shimmerStyle }} />
            </div>

            {/* Stats Skeleton */}
            <div className="flex gap-8 justify-center lg:justify-start">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="text-center space-y-2">
                  <div className="skeleton-shimmer skeleton-glow h-8 sm:h-10 w-16 rounded-lg mx-auto" style={{ ...shimmerStyle, backgroundColor: 'rgba(2, 211, 254, 0.1)' }} />
                  <div className="skeleton-shimmer h-3 w-20 rounded-full mx-auto" style={{ ...shimmerStyle, backgroundColor: 'rgba(255,255,255,0.04)' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Image Skeleton */}
          <div className="relative z-10 hidden lg:block" style={{ perspective: '1000px' }}>
            <div ref={imageRef} className="relative" style={{ transformStyle: 'preserve-3d' }}>
              {/* Glow Effect */}
              <div className="absolute -inset-4 rounded-3xl opacity-50 blur-2xl skeleton-glow" style={{ background: 'linear-gradient(135deg, rgba(2, 211, 254, 0.15), rgba(78, 144, 225, 0.15), rgba(154, 92, 183, 0.15))' }} />

              {/* Image Container Skeleton */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] skeleton-shimmer" style={{ ...glassStyle, ...shimmerStyle }}>
                {/* Animated scan line */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ top: ['-100%', '200%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                  style={{ height: '50%', background: 'linear-gradient(to bottom, transparent, rgba(2, 211, 254, 0.08), transparent)' }}
                />
              </div>

              {/* Floating Card Skeleton 1 */}
              <div className="absolute -left-8 bottom-20 rounded-xl p-4 skeleton-shimmer skeleton-glow" style={{ ...glassStyle, ...shimmerStyle }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full skeleton-shimmer" style={{ ...shimmerStyle, backgroundColor: 'rgba(2, 211, 254, 0.15)' }} />
                  <div className="space-y-2">
                    <div className="h-4 w-20 rounded-full" style={{ ...shimmerStyle, backgroundColor: 'rgba(255,255,255,0.06)' }} />
                    <div className="h-3 w-24 rounded-full" style={{ ...shimmerStyle, backgroundColor: 'rgba(255,255,255,0.04)' }} />
                  </div>
                </div>
              </div>

              {/* Floating Card Skeleton 2 */}
              <div className="absolute -right-4 top-20 rounded-xl p-4 skeleton-shimmer skeleton-glow text-center" style={{ ...glassStyle, ...shimmerStyle }}>
                <div className="h-8 w-16 rounded-lg mx-auto mb-1" style={{ ...shimmerStyle, backgroundColor: 'rgba(154, 92, 183, 0.15)' }} />
                <div className="h-3 w-20 rounded-full mx-auto" style={{ ...shimmerStyle, backgroundColor: 'rgba(255,255,255,0.04)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: THEME.cyan }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        <span className="text-xs tracking-widest uppercase" style={{ color: THEME.textMuted }}>Loading Experience</span>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: `linear-gradient(to top, ${THEME.bg}, transparent)` }} />
    </section>
  );
};

export default HeroSkeleton;
