import pool from "../db.config.js";
import logger from "./logger.js";

// Separate in-memory caches
export const seoCache = new Map();
export const projectSeoCache = new Map();
export const serviceSeoCache = new Map();

// Normalize URL paths
export const normalizeSeoPath = (value = "") => {
  let slug = String(value).trim().split("?")[0].split("#")[0];

  slug = slug.replace(/^\/+|\/+$/g, "").toLowerCase();

  if (!slug || slug === "home") {
    return "/";
  }

  return `/${slug}`;
};

// Safely parse JSON values
const safeParseJSON = (value, fallback = []) => {
  if (!value) return fallback;

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Normalize all keyword formats into one comma-separated string
const normalizeKeywords = (value) => {
  if (!value) return "";

  // Site settings: comma-separated string
  if (typeof value === "string") {
    return value
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean)
      .join(", ");
  }

  // Project and service arrays
  const parsed = safeParseJSON(value, []);

  if (!Array.isArray(parsed)) {
    return "";
  }

  return parsed
    .map((item) => {
      // Project format: [{ name: "keyword" }]
      if (typeof item === "object" && item !== null) {
        return item.name || "";
      }

      // Service format: ["keyword"]
      return typeof item === "string" ? item : "";
    })
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .join(", ");
};

// Safely parse image JSON
const normalizeImage = (value) => {
  if (!value) return null;

  const image = safeParseJSON(value, null);

  if (!image || typeof image !== "object") {
    return null;
  }

  return image;
};

// Load all SEO data from MySQL
export const loadSeoCache = async () => {
  try {
    // 1. Static pages SEO
    const [seoPages] = await pool.query(`
      SELECT
        id,
        pageSlug,
        metaTitle,
        metaDescription,
        metaKeyword,
        canonicalURL,
        OGTitle,
        OGDescription,
        twitterCardType,
        metaRobots
      FROM seo_pages
      WHERE siteInfoId = 1
    `);

    // 2. Project SEO
    const [projects] = await pool.query(`
      SELECT
        id,
        title,
        slug,
        seoTitle,
        metaDesc,
        metaKeywords,
        canonicalUrl,
        ogProjectImage
      FROM projects
    `);

    // 3. Service SEO
    const [services] = await pool.query(`
      SELECT
        id,
        title,
        slug,
        seoMetaTitle,
        seoMetaDescription,
        seoKeywords,
        serviceImage
      FROM services
    `);

    // Build new caches before replacing existing ones
    const newSeoCache = new Map();
    const newProjectCache = new Map();
    const newServiceCache = new Map();

    // Static pages
    seoPages.forEach((page) => {
      const path = normalizeSeoPath(page.pageSlug);

      newSeoCache.set(path, {
        title: page.metaTitle || "",
        description: page.metaDescription || "",
        keywords: normalizeKeywords(page.metaKeyword),
        canonical: page.canonicalURL || "",
        ogTitle: page.OGTitle || page.metaTitle || "",
        ogDescription: page.OGDescription || page.metaDescription || "",
        ogImage: null,
        twitterCardType: page.twitterCardType || "summary_large_image",
        robots: page.metaRobots || "index, follow",
        type: "static",
        id: page.id,
      });
    });

    // Dynamic project pages
    projects.forEach((project) => {
      if (!project.slug) return;

      const path = normalizeSeoPath(`/project/${project.slug}`);

      newProjectCache.set(path, {
        title: project.seoTitle || project.title || "",
        description: project.metaDesc || "",
        keywords: normalizeKeywords(project.metaKeywords),
        canonical: project.canonicalUrl || "",
        ogTitle: project.seoTitle || project.title || "",
        ogDescription: project.metaDesc || "",
        ogImage: normalizeImage(project.ogProjectImage),
        twitterCardType: "summary_large_image",
        robots: "index, follow",
        type: "project",
        id: project.id,
      });
    });

    // Dynamic service pages
    services.forEach((service) => {
      if (!service.slug) return;

      const path = normalizeSeoPath(`/services/${service.slug}`);

      newServiceCache.set(path, {
        title: service.seoMetaTitle || service.title || "",
        description: service.seoMetaDescription || "",
        keywords: normalizeKeywords(service.seoKeywords),
        canonical: "",
        ogTitle: service.seoMetaTitle || service.title || "",
        ogDescription: service.seoMetaDescription || "",
        ogImage: normalizeImage(service.serviceImage),
        twitterCardType: "summary_large_image",
        robots: "index, follow",
        type: "service",
        id: service.id,
      });
    });

    // Replace caches only after successful queries and mapping
    seoCache.clear();
    projectSeoCache.clear();
    serviceSeoCache.clear();

    for (const [key, value] of newSeoCache) {
      seoCache.set(key, value);
    }

    for (const [key, value] of newProjectCache) {
      projectSeoCache.set(key, value);
    }

    for (const [key, value] of newServiceCache) {
      serviceSeoCache.set(key, value);
    }

    logger.info(
      `SEO CACHE LOADED: Static ${seoCache.size}, Projects ${projectSeoCache.size}, Services ${serviceSeoCache.size}`,
    );

    return true;
  } catch (error) {
    logger.error("SEO CACHE LOAD ERROR:", error);
    throw error;
  }
};

// Resolve SEO by URL
export const getSeoByPath = (url) => {
  const path = normalizeSeoPath(url);

  return (
    seoCache.get(path) ||
    projectSeoCache.get(path) ||
    serviceSeoCache.get(path) ||
    null
  );
};

// Refresh all SEO caches
export const refreshSeoCache = async () => {
  return loadSeoCache();
};
