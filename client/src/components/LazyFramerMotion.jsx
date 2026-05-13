// src/components/ui/LazyFramerMotion/LazyFramerMotion.jsx

import { Component, memo, useEffect, useMemo, useState } from 'react';

// 🛡️ Error Boundary - Plain JS Class
class MotionErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('🔥 Motion Error:', error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// 🔄 Internal Wrapper - Applies LazyMotion
const MotionContentWrapper = ({ children, features, className, style }) => {
  // Dynamic import for code splitting
  const MotionWrapper = useMemo(() => {
    return ({ children: child }) => {
      // Import framer-motion features
      const { LazyMotion, domAnimation, domMax } = require('framer-motion');
      const featureSet = features === 'domMax' ? domMax : domAnimation;

      return <LazyMotion features={featureSet}>{child}</LazyMotion>;
    };
  }, [features]);

  return (
    <div className={className} style={style}>
      <MotionWrapper>{children}</MotionWrapper>
    </div>
  );
};

// 🚀 Main Exported Component - Plain JS
export const LazyFramerMotion = memo(
  ({
    children,
    features = 'domAnimation',
    fallback = null,
    disableLazyInDev = true,
    preload = true,
    errorFallback = null,
    onLoad,
    onError,
    wrapperClassName = '',
    reserveSpace = true,
  }) => {
    const [isReady, setIsReady] = useState(false);
    const [loadError, setLoadError] = useState(null);

    const isDev = process.env.NODE_ENV === 'development';
    const shouldLazyLoad = !(disableLazyInDev && isDev);

    // 🎯 Dynamically load framer-motion features
    useEffect(() => {
      if (!shouldLazyLoad || isReady) return;

      let cancelled = false;

      const loadFeatures = async () => {
        try {
          // Dynamic import for code splitting
          await import('framer-motion');

          if (cancelled) return;

          setIsReady(true);
          if (onLoad) onLoad();
        } catch (error) {
          if (cancelled) return;
          const err = error instanceof Error ? error : new Error('Motion load failed');
          setLoadError(err);
          if (onError) onError(err);
          console.error('❌ Motion load error:', err);
        }
      };

      const timer = setTimeout(loadFeatures, preload ? 0 : 50);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }, [shouldLazyLoad, isReady, preload, onLoad, onError]);

    // 🎨 CLS Prevention - Reserve space
    const wrapperStyle = useMemo(() => {
      return reserveSpace ? { minHeight: '1px', contain: 'layout' } : undefined;
    }, [reserveSpace]);

    // ⚡ Dev Mode: Skip lazy loading for faster HMR
    if (isDev && disableLazyInDev) {
      return (
        <div className={wrapperClassName} style={wrapperStyle}>
          {children}
        </div>
      );
    }

    // ❌ Error State: Show fallback
    if (loadError) {
      return (
        <MotionErrorBoundary fallback={errorFallback || children}>
          <div className={wrapperClassName} style={wrapperStyle}>
            {errorFallback || children}
          </div>
        </MotionErrorBoundary>
      );
    }

    // ⏳ Loading State: Show fallback
    if (!isReady && shouldLazyLoad) {
      return (
        <div className={wrapperClassName} style={wrapperStyle}>
          {fallback || children}
        </div>
      );
    }

    // ✅ Loaded: Render with LazyMotion
    return (
      <MotionErrorBoundary fallback={errorFallback || children}>
        <MotionContentWrapper features={features} className={wrapperClassName} style={wrapperStyle}>
          {children}
        </MotionContentWrapper>
      </MotionErrorBoundary>
    );
  }
);

LazyFramerMotion.displayName = 'LazyFramerMotion';
export default LazyFramerMotion;
