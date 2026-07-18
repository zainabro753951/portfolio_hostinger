import pool from '../db.config.js'
import { safeParse } from '../Utils/SafeParser.js'
import { deleteFromLocal, uploadToLocal } from '../Utils/uploadToLocal.js'

// Helper function for safe JSON parsing
const parseJSON = (data) => {
  if (!data) return null
  return typeof data === 'string' ? safeParse(data) : data
}

export const addSiteSettings = async (req, res) => {
  let { contactInfo, seoPages = [], siteInfo, deletedSeoPageIds = [] } = req.body

  // 1. Safe Parsing
  siteInfo = parseJSON(siteInfo)
  contactInfo = parseJSON(contactInfo)
  seoPages = Array.isArray(seoPages) ? seoPages : parseJSON(seoPages) || []
  deletedSeoPageIds = Array.isArray(deletedSeoPageIds)
    ? deletedSeoPageIds
    : parseJSON(deletedSeoPageIds) || []

  const { websiteName, tagline, footerText, googleAnalytics, logoImageOBJ, faviconOBJ } =
    siteInfo || {}

  const { linkedin, github, facebook, instagram, email, contactPhone } = contactInfo || {}

  const parsedLogo = parseJSON(logoImageOBJ)
  const parsedFavicon = parseJSON(faviconOBJ)

  const newFilesKeys = []
  let connection

  try {
    // 2. Get DB Connection for Transaction (Massive Performance Boost)
    connection = await pool.getConnection()
    await connection.beginTransaction()

    // 3. Upload images in Parallel
    const [logoResult, faviconResult] = await Promise.all([
      req.files?.['siteInfo[logoImage]']?.[0]
        ? uploadToLocal(req.files['siteInfo[logoImage]'][0], 'site/logo')
        : Promise.resolve(null),
      req.files?.['siteInfo[favicon]']?.[0]
        ? uploadToLocal(req.files['siteInfo[favicon]'][0], 'site/favicon')
        : Promise.resolve(null),
    ])

    if (logoResult) newFilesKeys.push(logoResult.key)
    if (faviconResult) newFilesKeys.push(faviconResult.key)

    const finalLogoOBJ = JSON.stringify({
      key: logoResult?.key || parsedLogo?.key || null,
      url: logoResult?.url || parsedLogo?.url || null,
    })

    const finalFaviconOBJ = JSON.stringify({
      key: faviconResult?.key || parsedFavicon?.key || null,
      url: faviconResult?.url || parsedFavicon?.url || null,
    })

    // 4. UPSERT site_info (Replaces SELECT + INSERT/UPDATE)
    // Note: Ensure 'websiteName' or a specific ID is used as the unique constraint,
    // OR assume only 1 row exists. We use a dummy id=1 for singleton pattern.
    await connection.query(
      `INSERT INTO site_info (id, websiteName, tagline, footerText, googleAnalytics, logoImage, favicon)
       VALUES (1, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       websiteName=VALUES(websiteName), tagline=VALUES(tagline), footerText=VALUES(footerText),
       googleAnalytics=VALUES(googleAnalytics), logoImage=VALUES(logoImage), favicon=VALUES(favicon)`,
      [websiteName, tagline, footerText, googleAnalytics, finalLogoOBJ, finalFaviconOBJ]
    )

    // 5. UPSERT contact_info
    await connection.query(
      `INSERT INTO contact_info (siteInfoId, linkedin, github, facebook, instagram, email, contactPhone)
       VALUES (1, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       linkedin=VALUES(linkedin), github=VALUES(github), facebook=VALUES(facebook),
       instagram=VALUES(instagram), email=VALUES(email), contactPhone=VALUES(contactPhone)`,
      [linkedin, github, facebook, instagram, email, contactPhone]
    )

    // 6. Delete SEO Pages (Batch Delete)
    if (deletedSeoPageIds.length > 0) {
      await connection.query(`DELETE FROM seo_pages WHERE id IN (?)`, [deletedSeoPageIds])
    }

    // 7. Bulk UPSERT for SEO Pages (The Biggest Performance Fix)
    if (seoPages.length > 0) {
      const values = seoPages.map((page) => [
        1, // siteInfoId (Singleton pattern)
        page.pageSlug,
        page.metaTitle,
        page.metaDescription,
        page.metaKeyword,
        page.canonicalURL,
        page.OGTitle,
        page.OGDescription,
        page.twitterCardType,
        page.metaRobots,
        page.id || null, // Used for ON DUPLICATE KEY UPDATE
      ])

      const placeholders = values.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ')

      await connection.query(
        `INSERT INTO seo_pages (siteInfoId, pageSlug, metaTitle, metaDescription, metaKeyword, canonicalURL, OGTitle, OGDescription, twitterCardType, metaRobots, id)
         VALUES ${placeholders}
         ON DUPLICATE KEY UPDATE
         pageSlug=VALUES(pageSlug), metaTitle=VALUES(metaTitle), metaDescription=VALUES(metaDescription),
         metaKeyword=VALUES(metaKeyword), canonicalURL=VALUES(canonicalURL), OGTitle=VALUES(OGTitle),
         OGDescription=VALUES(OGDescription), twitterCardType=VALUES(twitterCardType), metaRobots=VALUES(metaRobots)`,
        values.flat()
      )
    }

    // 8. Commit Transaction
    await connection.commit()

    // 9. Cleanup old files ONLY after successful DB commit
    if (logoResult && parsedLogo?.key && logoResult.key !== parsedLogo.key) {
      await deleteFromLocal(parsedLogo.key).catch(console.error)
    }
    if (faviconResult && parsedFavicon?.key && faviconResult.key !== parsedFavicon.key) {
      await deleteFromLocal(parsedFavicon.key).catch(console.error)
    }

    return res.status(200).json({
      success: true,
      message: 'Settings saved successfully and blazing fast! 🚀',
    })
  } catch (error) {
    // Rollback DB changes on error
    if (connection) await connection.rollback()

    console.error('❌ SiteSettings Error:', error)

    // Rollback newly uploaded files on error
    for (const key of newFilesKeys) {
      await deleteFromLocal(key).catch((e) => console.error('File Rollback failed:', e))
    }

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error. Changes rolled back safely.',
    })
  } finally {
    // Always release the connection back to the pool
    if (connection) connection.release()
  }
}

export const getSiteSettings = async (req, res) => {
  try {
    // Optimized Single Query with LEFT JOINs
    // Assumes siteInfoId = 1 (Singleton pattern). Adjust if your logic differs.
    const [rows] = await pool.query(
      `SELECT
        si.id AS siteInfoId, si.websiteName, si.tagline, si.footerText, si.googleAnalytics, si.logoImage, si.favicon,
        ci.linkedin, ci.github, ci.facebook, ci.instagram, ci.email, ci.contactPhone,
        sp.id AS seoPageId, sp.pageSlug, sp.metaTitle, sp.metaDescription, sp.metaKeyword,
        sp.canonicalURL, sp.OGTitle, sp.OGDescription, sp.twitterCardType, sp.metaRobots
      FROM site_info si
      LEFT JOIN contact_info ci ON si.id = ci.siteInfoId
      LEFT JOIN seo_pages sp ON si.id = sp.siteInfoId
      WHERE si.id = 1
      ORDER BY sp.id ASC`
    )

    if (!rows || rows.length === 0 || !rows[0].siteInfoId) {
      return res.status(404).json({
        success: false,
        message: 'No site settings found!',
      })
    }

    // Safe JSON parsing with fallback
    const parseSafe = (str) => {
      try {
        return str ? JSON.parse(str) : {}
      } catch (e) {
        return {}
      }
    }

    const siteSettings = {
      siteInfo: {
        id: rows[0].siteInfoId,
        websiteName: rows[0].websiteName,
        tagline: rows[0].tagline,
        footerText: rows[0].footerText,
        googleAnalytics: rows[0].googleAnalytics,
        logoImage: parseSafe(rows[0].logoImage),
        favicon: parseSafe(rows[0].favicon),
      },
      contactInfo: {
        linkedin: rows[0].linkedin || '',
        github: rows[0].github || '',
        facebook: rows[0].facebook || '',
        instagram: rows[0].instagram || '',
        email: rows[0].email || '',
        contactPhone: rows[0].contactPhone || '',
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
    }

    return res.status(200).json({
      success: true,
      siteSettings,
    })
  } catch (error) {
    console.error('❌ getSiteSettings Error:', error)
    return res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal Server Error!',
    })
  }
}
