import { useMotionPrefs } from '@/lib/motion';
import { AnimatePresence, motion } from 'motion/react';
import PropTypes from 'prop-types';
import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

// URL sanitizer
const sanitizeUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (/^(javascript|vbscript):/i.test(trimmed)) return null;
  return trimmed;
};

const LazyImage = ({
  src,
  alt = 'Image',
  fallback,
  animation = 'fade',
  duration = 0.5,
  delay = 0,
  onLoad,
  onError,
  className = '',
  style = {},
  eager = false,
  crossOrigin = true,
  placeholderColor = 'rgb(var(--surface-card))',
  objectFit = 'cover',
  objectPosition = 'center',
  ...rest
}) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const fallbackTriedRef = useRef(false);
  const shimmerId = useId();

  const { reduced } = useMotionPrefs();

  const initialSrc = useMemo(() => {
    const validSrc = sanitizeUrl(src);
    if (validSrc) return validSrc;
    const validFallback = sanitizeUrl(fallback);
    return validFallback || null;
  }, [src, fallback]);

  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(!initialSrc);
  const [isVisible, setIsVisible] = useState(eager);

  // Sync state if src or fallback props change
  useEffect(() => {
    fallbackTriedRef.current = false;
    const validSrc = sanitizeUrl(src);
    if (validSrc) {
      setCurrentSrc(validSrc);
      setIsLoaded(false);
      setHasError(false);
    } else {
      const validFallback = sanitizeUrl(fallback);
      if (validFallback) {
        setCurrentSrc(validFallback);
        setIsLoaded(false);
        setHasError(false);
        fallbackTriedRef.current = true;
      } else {
        setCurrentSrc(null);
        setIsLoaded(false);
        setHasError(true);
      }
    }
  }, [src, fallback]);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (eager || isVisible) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px', threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [eager, isVisible]);

  // Handle cached images that load instantly before onLoad triggers
  useEffect(() => {
    if (!imgRef.current || !currentSrc || isLoaded) return;
    if (imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
      onLoad?.(currentSrc);
    }
  }, [currentSrc, isLoaded, onLoad]);

  // Preload link for eager images
  useEffect(() => {
    if (!eager || !currentSrc || typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = currentSrc;
    if (crossOrigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, [eager, currentSrc, crossOrigin]);

  const handleLoad = useCallback(() => {
    if (!imgRef.current) return;
    if (imgRef.current.naturalWidth > 0 || imgRef.current.complete) {
      setIsLoaded(true);
      setHasError(false);
      onLoad?.(currentSrc);
    }
  }, [currentSrc, onLoad]);

  const handleError = useCallback(
    (e) => {
      const sanitizedFallback = sanitizeUrl(fallback);
      // Try fallback if primary src failed and fallback is available and not yet tried
      if (!fallbackTriedRef.current && sanitizedFallback && sanitizedFallback !== currentSrc) {
        fallbackTriedRef.current = true;
        setCurrentSrc(sanitizedFallback);
        setIsLoaded(false);
        setHasError(false);
        return;
      }

      setHasError(true);
      setIsLoaded(false);
      onError?.(e);
    },
    [currentSrc, fallback, onError]
  );

  // Animation variants
  const animationVariants = useMemo(() => {
    if (reduced || animation === 'none') {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
      };
    }
    switch (animation) {
      case 'slide':
        return {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.96 },
          animate: { opacity: 1, scale: 1 },
        };
      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
        };
    }
  }, [animation, reduced]);

  return (
    <div
      ref={containerRef}
      className={`relative isolate overflow-hidden bg-surface-card ${className}`}
      style={{ backgroundColor: placeholderColor, ...style }}
    >
      {/* Shimmer skeleton while loading */}
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div
            key={`shimmer-${shimmerId}`}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.02) 100%)',
              backgroundSize: '200% 100%',
              animation: 'ds-lazy-shimmer 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Error state */}
      {hasError && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center p-3 text-center bg-surface-card border border-line-subtle"
          role="img"
          aria-label={alt || 'Image failed to load'}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-ink-muted/60 mb-1.5"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="text-[11px] font-medium text-ink-muted select-none">
            Image unavailable
          </span>
        </div>
      )}

      {/* Actual image rendered with motion when visible */}
      {isVisible && currentSrc && !hasError && (
        <motion.img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          crossOrigin={crossOrigin ? 'anonymous' : undefined}
          decoding="async"
          fetchPriority={eager ? 'high' : 'auto'}
          initial={animationVariants.initial}
          animate={isLoaded ? animationVariants.animate : animationVariants.initial}
          transition={{
            duration: reduced ? 0.01 : duration,
            delay: reduced ? 0 : delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          onLoad={handleLoad}
          onError={handleError}
          className="h-full w-full select-none"
          style={{
            objectFit,
            objectPosition,
          }}
          {...rest}
        />
      )}

      <style>{`
        @keyframes ds-lazy-shimmer {
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
  animation: PropTypes.oneOf(['fade', 'slide', 'scale', 'none']),
  duration: PropTypes.number,
  delay: PropTypes.number,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  eager: PropTypes.bool,
  crossOrigin: PropTypes.bool,
  placeholderColor: PropTypes.string,
  objectFit: PropTypes.oneOf(['cover', 'contain', 'fill', 'none', 'scale-down']),
  objectPosition: PropTypes.string,
};

export default memo(LazyImage);
