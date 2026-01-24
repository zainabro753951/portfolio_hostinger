import pool from "../db.config.js";
import { deleteFromLocal, uploadToLocal } from "../Utils/uploadToLocal.js";
import { safeParse } from "../Utils/SafeParser.js";

export const addSiteSettings = async (req, res) => {
  let {
    contactInfo,
    seoPages,
    siteInfo,
    isUpdate,
    deletedSeoPageIds = [],
  } = req.body;

  // Safe parsing for nested objects (Hostinger par req.body strings bhej sakta hai)
  const parseData = (data) =>
    typeof data === "string" ? safeParse(data) : data;

  siteInfo = parseData(siteInfo);
  contactInfo = parseData(contactInfo);
  seoPages = parseData(seoPages);
  deletedSeoPageIds = parseData(deletedSeoPageIds);

  let {
    websiteName,
    tagline,
    footerText,
    googleAnalytics,
    logoImageOBJ,
    faviconOBJ,
  } = siteInfo;
  const { linkedin, github, facebook, instagram, email, contactPhone } =
    contactInfo;

  logoImageOBJ = parseData(logoImageOBJ);
  faviconOBJ = parseData(faviconOBJ);

  const newFilesKeys = []; // Tracking for rollback

  try {
    // 1. Upload images (Local Storage)
    const [logoResult, faviconResult] = await Promise.all([
      req.files?.["siteInfo[logoImage]"]?.[0]
        ? uploadToLocal(req.files["siteInfo[logoImage]"][0], "site/logo")
        : Promise.resolve(null),
      req.files?.["siteInfo[favicon]"]?.[0]
        ? uploadToLocal(req.files["siteInfo[favicon]"][0], "site/favicon")
        : Promise.resolve(null),
    ]);

    if (logoResult) newFilesKeys.push(logoResult.key);
    if (faviconResult) newFilesKeys.push(faviconResult.key);

    const finalLogoOBJ = {
      key: logoResult?.key || logoImageOBJ?.key || null,
      url: logoResult?.url || logoImageOBJ?.url || null,
    };
    const finalFaviconOBJ = {
      key: faviconResult?.key || faviconOBJ?.key || null,
      url: faviconResult?.url || faviconOBJ?.url || null,
    };

    // 2. Handle site_info logic
    const [existingSite] = await pool.query(`SELECT id FROM site_info LIMIT 1`);
    let siteInfoId;

    if (!existingSite.length) {
      const [result] = await pool.query(
        `INSERT INTO site_info (websiteName, tagline, footerText, googleAnalytics, logoImage, favicon) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          websiteName,
          tagline,
          footerText,
          googleAnalytics,
          JSON.stringify(finalLogoOBJ),
          JSON.stringify(finalFaviconOBJ),
        ],
      );
      siteInfoId = result.insertId;
    } else {
      siteInfoId = existingSite[0].id;

      // Old images cleanup
      if (logoResult && logoImageOBJ?.key)
        await deleteFromLocal(logoImageOBJ.key);
      if (faviconResult && faviconOBJ?.key)
        await deleteFromLocal(faviconOBJ.key);

      await pool.query(
        `UPDATE site_info SET websiteName=?, tagline=?, footerText=?, googleAnalytics=?, logoImage=?, favicon=? WHERE id=?`,
        [
          websiteName,
          tagline,
          footerText,
          googleAnalytics,
          JSON.stringify(finalLogoOBJ),
          JSON.stringify(finalFaviconOBJ),
          siteInfoId,
        ],
      );
    }

    // 3. Handle contact_info (One-to-One)
    const [existingContact] = await pool.query(
      `SELECT id FROM contact_info WHERE siteInfoId = ?`,
      [siteInfoId],
    );
    if (!existingContact.length) {
      await pool.query(
        `INSERT INTO contact_info (siteInfoId, linkedin, github, facebook, instagram, email, contactPhone) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          siteInfoId,
          linkedin,
          github,
          facebook,
          instagram,
          email,
          contactPhone,
        ],
      );
    } else {
      await pool.query(
        `UPDATE contact_info SET linkedin=?, github=?, facebook=?, instagram=?, email=?, contactPhone=? WHERE siteInfoId=?`,
        [
          linkedin,
          github,
          facebook,
          instagram,
          email,
          contactPhone,
          siteInfoId,
        ],
      );
    }

    // 4. Handle SEO Pages (Delete)
    if (Array.isArray(deletedSeoPageIds) && deletedSeoPageIds.length > 0) {
      await pool.query(`DELETE FROM seo_pages WHERE id IN (?)`, [
        deletedSeoPageIds,
      ]);
    }

    // 5. Handle SEO Pages (Upsert)
    if (Array.isArray(seoPages)) {
      for (const page of seoPages) {
        if (page.isUpdate && page.id) {
          await pool.query(
            `UPDATE seo_pages SET pageSlug=?, metaTitle=?, metaDescription=?, metaKeyword=?, canonicalURL=?, OGTitle=?, OGDescription=?, twitterCardType=?, metaRobots=? WHERE id=?`,
            [
              page.pageSlug,
              page.metaTitle,
              page.metaDescription,
              page.metaKeyword,
              page.canonicalURL,
              page.OGTitle,
              page.OGDescription,
              page.twitterCardType,
              page.metaRobots,
              page.id,
            ],
          );
        } else {
          await pool.query(
            `INSERT INTO seo_pages (siteInfoId, pageSlug, metaTitle, metaDescription, metaKeyword, canonicalURL, OGTitle, OGDescription, twitterCardType, metaRobots) VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [
              siteInfoId,
              page.pageSlug,
              page.metaTitle,
              page.metaDescription,
              page.metaKeyword,
              page.canonicalURL,
              page.OGTitle,
              page.OGDescription,
              page.twitterCardType,
              page.metaRobots,
            ],
          );
        }
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "Settings saved successfully!" });
  } catch (error) {
    console.error("❌ SiteSettings Error:", error);
    // Rollback new local files
    for (const key of newFilesKeys) {
      await deleteFromLocal(key).catch((e) =>
        console.error("Rollback failed", e),
      );
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
};

export const getSiteSettings = async (req, res) => {
  try {
    // ✅ Step 1: Get latest site_info.id (so we only fetch for that site)
    const [[latestSiteInfo]] = await pool.query(`
      SELECT id FROM site_info ORDER BY id DESC LIMIT 1
    `);

    if (!latestSiteInfo) {
      return res.status(404).json({
        success: false,
        message: "No site settings found!",
      });
    }

    const latestSiteInfoId = latestSiteInfo.id;

    // ✅ Step 2: Now get all data for that specific site_info.id
    const [rows] = await pool.query(
      `
      SELECT
        si.id AS siteInfoId,
        si.websiteName,
        si.tagline,
        si.footerText,
        si.googleAnalytics,
        si.logoImage,
        si.favicon,

        ci.linkedin,
        ci.github,
        ci.facebook,
        ci.instagram,
        ci.email,
        ci.contactPhone,

        sp.id AS seoPageId,
        sp.pageSlug,
        sp.metaTitle,
        sp.metaDescription,
        sp.metaKeyword,
        sp.canonicalURL,
        sp.OGTitle,
        sp.OGDescription,
        sp.twitterCardType,
        sp.metaRobots
      FROM site_info si
      LEFT JOIN contact_info ci ON si.id = ci.siteInfoId
      LEFT JOIN seo_pages sp ON si.id = sp.siteInfoId
      WHERE si.id = ?
      ORDER BY sp.id ASC
    `,
      [latestSiteInfoId],
    );

    // ✅ Step 3: Format response
    const siteSettings = {
      siteInfo: {
        id: rows[0].siteInfoId,
        websiteName: rows[0].websiteName,
        tagline: rows[0].tagline,
        footerText: rows[0].footerText,
        googleAnalytics: rows[0].googleAnalytics,
        logoImage: rows[0].logoImage,
        favicon: rows[0].favicon,
      },
      contactInfo: {
        linkedin: rows[0].linkedin,
        github: rows[0].github,
        facebook: rows[0].facebook,
        instagram: rows[0].instagram,
        email: rows[0].email,
        contactPhone: rows[0].contactPhone,
      },
      seoPages: rows
        .filter((row) => row.seoPageId !== null)
        .map((row) => ({
          id: row.seoPageId,
          pageSlug: row.pageSlug,
          metaTitle: row.metaTitle,
          metaDescription: row.metaDescription,
          metaKeyword: row.metaKeyword,
          canonicalURL: row.canonicalURL,
          OGTitle: row.OGTitle,
          OGDescription: row.OGDescription,
          twitterCardType: row.twitterCardType,
          metaRobots: row.metaRobots,
        })),
    };

    return res.status(200).json({
      success: true,
      siteSettings,
    });
  } catch (error) {
    console.error("❌ getSiteSettings Error:", error);
    return res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Internal Server Error!",
    });
  }
};
