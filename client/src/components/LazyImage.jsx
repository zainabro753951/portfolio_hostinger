import { useRef, useState, useEffect, useCallback, memo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import PropTypes from "prop-types";

gsap.registerPlugin(useGSAP);

// 🎯 Animation presets
const ANIMATION_PRESETS = {
  fade: {
    from: { opacity: 0, scale: 1 },
    to: { opacity: 1, scale: 1, ease: "power2.out" },
  },
  slide: {
    from: { y: 40, opacity: 0, scale: 1 },
    to: { y: 0, opacity: 1, scale: 1, ease: "power3.out" },
  },
  scale: {
    from: { scale: 0.85, opacity: 0 },
    to: { scale: 1, opacity: 1, ease: "back.out(1.2)" },
  },
  flip: {
    from: { rotateY: 90, opacity: 0, scale: 1 },
    to: { rotateY: 0, opacity: 1, scale: 1, ease: "power3.out" },
  },
  none: {
    from: { opacity: 1 },
    to: { opacity: 1 },
  },
};

// 🛡️ URL sanitizer
const sanitizeUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return null;
  return trimmed;
};

const LazyImage = ({
  src,
  alt = "Image",
  fallback,
  animation = "fade",
  duration = 0.8,
  delay = 0,
  onLoad,
  onError,
  className = "",
  style = {},
  eager = false,
  crossOrigin = true,
  placeholderColor = "#1a1a2e",
  objectFit = "cover",
  objectPosition = "center",
  ...rest
}) => {
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const loadAttemptRef = useRef(0);
  const hasAnimatedRef = useRef(false);

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(() => sanitizeUrl(src));
  const [isVisible, setIsVisible] = useState(eager);

  // 🎯 Intersection Observer for lazy loading
  useEffect(() => {
    if (eager || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px", threshold: 0 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [eager]);

  // 🔄 Handle src changes
  useEffect(() => {
    const sanitizedSrc = sanitizeUrl(src);

    if (!sanitizedSrc) {
      setHasError(true);
      setIsLoaded(false);
      hasAnimatedRef.current = false;
      return;
    }

    setIsLoaded(false);
    setHasError(false);
    loadAttemptRef.current = 0;
    hasAnimatedRef.current = false;
    setCurrentSrc(sanitizedSrc);
  }, [src]);

  // 🎯 Handle image load - CRITICAL FIX
  const handleLoad = useCallback(() => {
    // Ensure image is actually loaded in DOM
    if (!imgRef.current) return;

    // For cached images, complete might already be true
    if (imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
      onLoad?.(currentSrc);
    }
  }, [currentSrc, onLoad]);

  // 🎯 Handle image error with retry
  const handleError = useCallback(
    (e) => {
      loadAttemptRef.current += 1;
      console.warn(
        `Image load attempt ${loadAttemptRef.current} failed: ${currentSrc}`,
      );

      if (
        loadAttemptRef.current === 1 &&
        fallback &&
        sanitizeUrl(fallback) !== currentSrc
      ) {
        const sanitizedFallback = sanitizeUrl(fallback);
        if (sanitizedFallback) {
          setCurrentSrc(sanitizedFallback);
          setHasError(false);
          return;
        }
      }

      setHasError(true);
      setIsLoaded(false);
      hasAnimatedRef.current = false;
      onError?.(e);
    },
    [currentSrc, fallback, onError],
  );

  // 🎨 GSAP Animation - FIXED: No CSS opacity conflict
  useGSAP(
    () => {
      if (!isLoaded || !imgRef.current || animation === "none") return;
      if (hasAnimatedRef.current) return; // Prevent double animation

      const preset = ANIMATION_PRESETS[animation];
      if (!preset) return;

      // CRITICAL: Set initial state explicitly via GSAP, not CSS classes
      gsap.set(imgRef.current, preset.from);

      // Animate to final state
      gsap.to(imgRef.current, {
        ...preset.to,
        duration: animation === "flip" ? duration * 1.5 : duration,
        delay,
        clearProps: "all", // FIXED: Clear ALL props after animation
        onComplete: () => {
          hasAnimatedRef.current = true;
          // Ensure final state is clean
          gsap.set(imgRef.current, {
            opacity: 1,
            transform: "none",
            visibility: "visible",
          });
        },
      });
    },
    {
      scope: containerRef,
      dependencies: [isLoaded],
    },
  );

  // 🛡️ Preload for eager images
  useEffect(() => {
    if (!eager || !currentSrc) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = currentSrc;
    if (crossOrigin) link.crossOrigin = "anonymous";
    document.head.appendChild(link);

    return () => {
      if (link.parentNode) document.head.removeChild(link);
    };
  }, [eager, currentSrc, crossOrigin]);

  // Handle cached images that load instantly
  useEffect(() => {
    if (!imgRef.current || !currentSrc) return;

    // Check if already loaded (cached)
    if (
      imgRef.current.complete &&
      imgRef.current.naturalWidth > 0 &&
      !isLoaded
    ) {
      setIsLoaded(true);
    }
  }, [currentSrc, isLoaded]);

  // Don't render if lazy and not visible
  if (!isVisible || !currentSrc) {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden ${className}`}
        style={{ backgroundColor: placeholderColor, ...style }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: placeholderColor, ...style }}
    >
      {/* 🔄 Shimmer Placeholder */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              90deg,
              ${placeholderColor} 25%,
              ${placeholderColor}ee 50%,
              ${placeholderColor} 75%
            )`,
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      )}

      {/* ❌ Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 backdrop-blur-sm">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gray-500 mb-2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="text-gray-500 text-sm">Failed to load</span>
        </div>
      )}

      {/* 🖼️ Actual Image - FIXED: No CSS opacity classes! */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        crossOrigin={crossOrigin ? "anonymous" : undefined}
        decoding="async"
        fetchPriority={eager ? "high" : "auto"}
        className="w-full h-full"
        style={{
          objectFit,
          objectPosition,
          opacity: 0, // Start hidden, GSAP will animate this
          visibility: "visible",
        }}
        onLoad={handleLoad}
        onError={handleError}
        {...rest}
      />

      {/* 💫 CSS Animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  fallback: PropTypes.string,
  animation: PropTypes.oneOf(["fade", "slide", "scale", "flip", "none"]),
  duration: PropTypes.number,
  delay: PropTypes.number,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  eager: PropTypes.bool,
  crossOrigin: PropTypes.bool,
  placeholderColor: PropTypes.string,
  objectFit: PropTypes.oneOf([
    "cover",
    "contain",
    "fill",
    "none",
    "scale-down",
  ]),
  objectPosition: PropTypes.string,
};

export default memo(LazyImage);
