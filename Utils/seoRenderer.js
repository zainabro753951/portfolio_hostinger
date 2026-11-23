import fs from "node:fs/promises";
import path from "node:path";

import { getSeoByPath } from "./seoCache.js";

let htmlTemplate = null;

const escapeHtml = (value = "") => {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
};

export const renderSeoHtml = async (req, res, next, clientBuildPath) => {
  try {
    // Read HTML only once and keep it in memory
    if (!htmlTemplate) {
      htmlTemplate = await fs.readFile(
        path.join(clientBuildPath, "index.html"),
        "utf-8",
      );
    }

    // Admin routes should bypass dynamic SEO lookup
    if (req.path === "/admin" || req.path.startsWith("/admin/")) {
      return (
        res.setHeader("Cache-Control", "private, no-store"),
        res
          .status(200)
          .type("html")
          .send(htmlTemplate.replaceAll("__SEO_ROBOTS__", "noindex, nofollow"))
      );
    }

    // Find matching SEO record
    const seo = getSeoByPath(req.path);

    if (!seo) {
      return res.status(404).send("Page not found");
    }

    const siteUrl = (
      process.env.FRONTEND_URL || "https://www.zaincode.io"
    ).replace(/\/+$/, "");

    const canonicalURL =
      seo.canonical?.trim() || `${siteUrl}${req.path === "/" ? "" : req.path}`;

    const DEFAULT_OG_IMAGE =
      "https://res.cloudinary.com/db2vbllpf/image/upload/v1795330478/og-image-social-sharing_qkmfgr.png";

    const ogImage =
      (typeof seo.ogImage === "string" ? seo.ogImage : seo.ogImage?.url) ||
      DEFAULT_OG_IMAGE;

    const metadata = {
      title: escapeHtml(seo.title || "Zain Abro"),
      description: escapeHtml(seo.description || ""),
      keywords: escapeHtml(seo.keywords || ""),
      canonical: escapeHtml(canonicalURL),
      ogTitle: escapeHtml(seo.ogTitle || seo.title || ""),
      ogDescription: escapeHtml(seo.ogDescription || seo.description || ""),
      ogImage: escapeHtml(ogImage),
      twitterCard: escapeHtml(seo.twitterCardType || "summary_large_image"),
      robots: escapeHtml(seo.robots || "index, follow"),
    };

    let html = htmlTemplate;

    const replacements = {
      __SEO_TITLE__: metadata.title,
      __SEO_DESCRIPTION__: metadata.description,
      __SEO_KEYWORDS__: metadata.keywords,
      __SEO_CANONICAL__: metadata.canonical,
      __SEO_OG_TITLE__: metadata.ogTitle,
      __SEO_OG_DESCRIPTION__: metadata.ogDescription,
      __SEO_OG_IMAGE__: metadata.ogImage,
      __SEO_TWITTER_CARD__: metadata.twitterCard,
      __SEO_ROBOTS__: metadata.robots,
    };

    for (const [placeholder, value] of Object.entries(replacements)) {
      html = html.replaceAll(placeholder, value);
    }

    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");

    res.setHeader("Vary", "Accept-Encoding");

    return res.status(200).type("html").send(html);
  } catch (error) {
    return next(error);
  }
};
