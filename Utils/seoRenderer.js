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

    // Find matching SEO record
    const seo = getSeoByPath(req.path);

    // Homepage SEO as fallback
    const pageSeo = seo || getSeoByPath("/");

    if (!pageSeo) {
      return res.status(503).send("SEO settings are not available.");
    }

    const siteUrl = process.env.FRONTEND_URL;

    console.log(siteUrl);

    const canonicalURL =
      pageSeo.canonicalURL?.trim() ||
      `${siteUrl}${req.path === "/" ? "" : req.path}`;

    const metadata = {
      title: escapeHtml(pageSeo.metaTitle || "Zain Abro"),
      description: escapeHtml(pageSeo.metaDescription || ""),
      keywords: escapeHtml(pageSeo.metaKeyword || ""),
      canonical: escapeHtml(canonicalURL),
      ogTitle: escapeHtml(pageSeo.OGTitle || pageSeo.metaTitle || ""),
      ogDescription: escapeHtml(
        pageSeo.OGDescription || pageSeo.metaDescription || "",
      ),
      twitterCard: escapeHtml(pageSeo.twitterCardType || "summary_large_image"),
      robots: escapeHtml(pageSeo.metaRobots || "index, follow"),
    };

    // Inject SEO metadata into HTML
    let html = htmlTemplate;

    const replacements = {
      __SEO_TITLE__: metadata.title,
      __SEO_DESCRIPTION__: metadata.description,
      __SEO_KEYWORDS__: metadata.keywords,
      __SEO_CANONICAL__: metadata.canonical,
      __SEO_OG_TITLE__: metadata.ogTitle,
      __SEO_OG_DESCRIPTION__: metadata.ogDescription,
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
