import { useEffect } from 'react';

// ── Helper: Update or create meta tags ─────────────────────────
const updateMetaTag = (attr, name, content) => {
  if (!content) {
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
  tag.setAttribute('content', content);
};

// ── Helper: Inject or update JSON-LD script ────────────────────
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
// 🌐 REUSABLE DYNAMIC META UPDATER COMPONENT
// ═══════════════════════════════════════════════════════════════
export const DynamicMetaUpdater = ({ title, description, schemaId = 'dynamic-jsonld', schema }) => {
  useEffect(() => {
    if (!title && !description && !schema) return;

    // Update Document Title
    if (title) document.title = title;

    // Update Standard & Open Graph / Twitter Meta Tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:type', 'website');

    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);

    // Inject Structured Data (JSON-LD)
    if (schema && schemaId) {
      injectJsonLd(schemaId, schema);
    }

    // Cleanup on unmount or prop change
    return () => {
      if (schemaId) {
        const existing = document.getElementById(schemaId);
        if (existing) existing.remove();
      }
    };
  }, [title, description, schema, schemaId]);

  return null;
};

export default DynamicMetaUpdater;
