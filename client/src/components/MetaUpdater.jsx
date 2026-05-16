import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// ═══════════════════════════════════════════════════════════════
// 🛠️ HELPER FUNCTIONS (Extracted for Performance & Cleanliness)
// ═══════════════════════════════════════════════════════════════

const updateMetaTag = (attr, name, content, defaultValue = '') => {
  const value = content || defaultValue;
  if (!value) {
    const existing = document.querySelector(`meta[${attr}="${name}"]`);
    if (existing) existing.remove();
    return;
  }

  let tag = document.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', value);
};

const updateLinkTag = (rel, href) => {
  if (!href) return;

  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const injectJsonLd = (id, data) => {
  if (!data) {
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    return;
  }

  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

// ═══════════════════════════════════════════════════════════════
// 🌐 MAIN META UPDATER COMPONENT
// ═══════════════════════════════════════════════════════════════
const MetaUpdater = () => {
  const { site_info, seo_pages, isLoading } = useSelector((state) => state.siteSettings);
  const location = useLocation();
  const gaInitializedRef = useRef(false);
  const prevPathRef = useRef(location.pathname);

  // Memoized GA injection
  const initializeGoogleAnalytics = useCallback((code) => {
    if (!code || typeof window === 'undefined' || gaInitializedRef.current) return;

    const match = code.match(/G-[A-Z0-9]+/i);
    const measurementId = match ? match[0] : null;

    if (!measurementId) return;

    // Prevent duplicate script injection
    const existingScript = document.querySelector('script[data-ga-initialized="true"]');
    if (existingScript) {
      gaInitializedRef.current = true;
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.dataset.gaInitialized = 'true';
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      const gtag = (...args) => window.dataLayer.push(args);
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', measurementId);
      gaInitializedRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (isLoading || !site_info) return;

    const currentPath = location.pathname.replace(/\/+$/, '') || '/';

    // 🚫 Skip meta update for dynamic routes that handle their own meta data
    const isServicePage = /^\/services\/.+/.test(currentPath);
    const isProjectPage = /^\/projects\/.+/.test(currentPath);

    if (isServicePage || isProjectPage) {
      prevPathRef.current = currentPath;
      return;
    }

    if (currentPath === prevPathRef.current && !site_info.websiteName) return;
    prevPathRef.current = currentPath;

    const currentSEO = seo_pages?.find((page) => page.pageSlug === currentPath);

    // ─── Core SEO Data ───
    const baseUrl = window.location.origin;
    const metaTitle =
      currentSEO?.metaTitle ||
      `${site_info.websiteName || 'Portfolio'} | ${site_info.tagline || 'Digital Solutions'}`;
    const metaDescription =
      currentSEO?.metaDescription ||
      site_info.tagline ||
      'Professional web development and design services.';
    const metaKeywords = currentSEO?.metaKeyword || site_info.keywords || '';
    const metaRobots = currentSEO?.metaRobots || 'index, follow';
    const themeColor = site_info.themeColor || '#0a0a0f';

    // Resolve absolute URL for OG image
    let rawOgImage = site_info.logoImage?.url || site_info.favicon?.url || '';
    const ogImage = rawOgImage
      ? rawOgImage.startsWith('http')
        ? rawOgImage
        : `${baseUrl}/${rawOgImage.replace(/^\/+/, '')}`
      : '';
    const canonical = `${baseUrl}${currentPath}`;

    // ─── Apply Meta Tags ───
    document.title = metaTitle;

    updateMetaTag('name', 'description', metaDescription);
    updateMetaTag('name', 'keywords', metaKeywords);
    updateMetaTag('name', 'robots', metaRobots);
    updateMetaTag(
      'name',
      'author',
      site_info.authorName || site_info.websiteName || 'Portfolio Developer'
    );
    updateMetaTag('name', 'theme-color', themeColor);
    updateMetaTag('name', 'viewport', 'width=device-width, initial-scale=1.0');

    updateMetaTag('property', 'og:title', metaTitle);
    updateMetaTag('property', 'og:description', metaDescription);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:image:secure_url', ogImage);
    updateMetaTag(
      'property',
      'og:image:type',
      ogImage.endsWith('.png')
        ? 'image/png'
        : ogImage.endsWith('.jpg') || ogImage.endsWith('.jpeg')
          ? 'image/jpeg'
          : 'image/webp'
    );
    updateMetaTag('property', 'og:url', canonical);
    updateMetaTag('property', 'og:type', 'website');
    updateMetaTag('property', 'og:locale', site_info.locale || 'en_US');
    updateMetaTag('property', 'og:site_name', site_info.websiteName || 'Portfolio');

    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', metaTitle);
    updateMetaTag('name', 'twitter:description', metaDescription);
    updateMetaTag('name', 'twitter:image', ogImage);
    updateMetaTag('name', 'twitter:site', site_info.twitterHandle || '');

    // ─── Links ───
    updateLinkTag('canonical', canonical);

    // ─── Favicon ───
    if (site_info.favicon?.url) {
      const faviconUrl = site_info.favicon.url.startsWith('http')
        ? site_info.favicon.url
        : `${baseUrl}/${site_info.favicon.url.replace(/^\/+/, '')}`;

      updateLinkTag('icon', faviconUrl);
      updateLinkTag('shortcut icon', faviconUrl);
    }

    // ─── Structured Data (JSON-LD) ───
    const webSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site_info.websiteName || 'Portfolio',
      url: baseUrl,
      description: metaDescription,
      author: {
        '@type': 'Person',
        name: site_info.authorName || 'Developer',
      },
    };
    injectJsonLd('jsonld-website', webSchema);

    // ─── Google Analytics ───
    initializeGoogleAnalytics(site_info.googleAnalytics);
  }, [
    site_info,
    seo_pages,
    location.pathname,
    location.search,
    isLoading,
    initializeGoogleAnalytics,
  ]);

  return null;
};

export default MetaUpdater;
