import { body, validationResult } from "express-validator";
import pool from "../db.config.js";
import { parseBoolean, safeParse } from "../Utils/SafeParser.js";
import { deleteFromLocal, uploadToLocal } from "../Utils/uploadToLocal.js"; // Local Storage Helpers
import { uploadFile } from "../Utils/uploadToCloudinary.js";
import { deleteFromCloudinary } from "../Utils/deleteFromCloudinary.js";

/* ✅ Validation Schema */
export const experienceValidation = [
  body("position").trim().notEmpty().withMessage("Position is required"),
  body("company").trim().notEmpty().withMessage("Company name is required"),
  body("startedAt").notEmpty().withMessage("Start date is required"),
  body("currentlyWorking")
    .isBoolean()
    .withMessage("Currently working must be a boolean"),
  body("description").trim().notEmpty().withMessage("Description is required"),
];

// Existing cache
let experienceCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 10 * 60 * 1000;

// Clear experience cache
export const clearExpCache = () => {
  experienceCache = null;
  cacheTimestamp = 0;
};

// Safely parse image JSON
const parseCompanyLogo = (value) => {
  if (!value) return null;

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;

    if (!parsed?.key || !parsed?.url) return null;

    return {
      key: parsed.key,
      url: parsed.url,
      resource_type: parsed.resource_type || "image",
    };
  } catch {
    return null;
  }
};

export const addExp = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errorCode: "VALIDATION_ERROR",
      message: errors.array()[0].msg,
    });
  }

  let {
    isUpdate,
    expId,
    position,
    company,
    employmentType,
    startedAt,
    endDate,
    currentlyWorking,
    description,
    technologies,
  } = req.body;

  isUpdate = parseBoolean(isUpdate);
  const isCurrentlyWorking = parseBoolean(currentlyWorking);

  const normalizedEndDate = isCurrentlyWorking ? null : endDate || null;

  let newUploadedLogo = null;
  let oldLogo = null;

  try {
    // 1. Validate experience ID and fetch existing record on update
    if (isUpdate) {
      if (!expId || !Number.isInteger(Number(expId))) {
        return res.status(400).json({
          success: false,
          message: "Valid experience ID is required!",
        });
      }

      const [existingRows] = await pool.query(
        "SELECT companyLogo FROM work_experience WHERE id = ?",
        [expId],
      );

      if (!existingRows.length) {
        return res.status(404).json({
          success: false,
          message: "Experience not found!",
        });
      }

      // Database is the source of truth for the old logo
      oldLogo = parseCompanyLogo(existingRows[0].companyLogo);
    }

    // 2. Upload new logo to Cloudinary if provided
    if (req.file) {
      newUploadedLogo = await uploadFile(req.file, "experience");
    }

    // 3. Decide which logo should be stored
    const finalLogo = newUploadedLogo || oldLogo || null;

    // 4. UPDATE existing experience
    if (isUpdate) {
      await pool.query(
        `UPDATE work_experience
         SET position = ?,
             company = ?,
             employmentType = ?,
             startedAt = ?,
             endDate = ?,
             currentlyWorking = ?,
             description = ?,
             technologies = ?,
             companyLogo = ?,
             updatedAt = NOW()
         WHERE id = ?`,
        [
          position,
          company,
          employmentType || "Full-time",
          startedAt,
          normalizedEndDate,
          isCurrentlyWorking,
          description,
          technologies || null,
          JSON.stringify(finalLogo),
          expId,
        ],
      );

      // 5. Delete old logo only after DB update succeeds
      if (newUploadedLogo && oldLogo?.key) {
        const deleteResult = await deleteFromCloudinary({
          key: oldLogo.key,
          resource_type: oldLogo.resource_type || "image",
        });

        if (!deleteResult?.success) {
          console.error(
            "OLD_EXPERIENCE_LOGO_CLEANUP_FAILED:",
            deleteResult?.error,
          );
        }
      }

      clearExpCache();

      return res.status(200).json({
        success: true,
        message: "Experience updated successfully!",
      });
    }

    // 6. INSERT new experience
    await pool.query(
      `INSERT INTO work_experience
       (
         position,
         company,
         employmentType,
         startedAt,
         endDate,
         currentlyWorking,
         description,
         technologies,
         companyLogo
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        position,
        company,
        employmentType || "Full-time",
        startedAt,
        normalizedEndDate,
        isCurrentlyWorking,
        description,
        technologies || null,
        JSON.stringify(finalLogo),
      ],
    );

    clearExpCache();

    return res.status(201).json({
      success: true,
      message: "Experience added successfully!",
    });
  } catch (error) {
    console.error("EXPERIENCE_CONTROLLER_ERROR:", error);

    // 7. Rollback newly uploaded image if DB operation fails
    if (newUploadedLogo?.key) {
      const rollbackResult = await deleteFromCloudinary({
        key: newUploadedLogo.key,
        resource_type: newUploadedLogo.resource_type || "image",
      });

      if (!rollbackResult?.success) {
        console.error(
          "NEW_EXPERIENCE_LOGO_ROLLBACK_FAILED:",
          rollbackResult?.error,
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

export const deleteExp = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Find experience
    const [rows] = await pool.query(
      "SELECT companyLogo FROM work_experience WHERE id = ?",
      [id],
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Experience not found!",
      });
    }

    // 2. Parse Cloudinary logo data
    const logoData =
      typeof rows[0].companyLogo === "string"
        ? safeParse(rows[0].companyLogo)
        : rows[0].companyLogo;

    // 3. Delete logo from Cloudinary
    if (logoData?.key) {
      const deleteResult = await deleteFromCloudinary({
        key: logoData.key,
        resource_type: logoData.resource_type || "image",
      });

      if (!deleteResult?.success) {
        console.error("EXPERIENCE_LOGO_DELETE_FAILED:", deleteResult?.error);

        return res.status(500).json({
          success: false,
          message:
            "Unable to delete experience logo. Experience was not deleted!",
        });
      }
    }

    // 4. Delete experience from database
    await pool.query("DELETE FROM work_experience WHERE id = ?", [id]);

    // 5. Clear experience cache
    clearExpCache();

    return res.status(200).json({
      success: true,
      message: "Experience and its logo deleted successfully!",
    });
  } catch (error) {
    console.error("DELETE_EXP_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// Controller: Get all experiences (Highly Optimized)
export const getExp = async (req, res) => {
  try {
    const now = Date.now();

    // 1. Check if valid cache exists
    if (experienceCache && now - cacheTimestamp < CACHE_TTL) {
      return res.status(200).json({
        success: true,
        total: experienceCache.length,
        experiences: experienceCache,
        cached: true, // Frontend debugging ke liye (optional)
      });
    }

    // 2. Fetch ONLY required columns from DB (Faster than SELECT *)
    const [rows] = await pool.query(
      `SELECT
        id, position, company, employmentType, startedAt, endDate,
        description, technologies, companyLogo, currentlyWorking
       FROM work_experience
       ORDER BY startedAt DESC`,
    );

    // 3. Safely parse any JSON fields (e.g., technologies, achievements)
    const parsedExperiences = rows.map((row) => ({
      ...row,
      technologies: safeParse(row.technologies) || [],
      achievements: safeParse(row.achievements) || [],
      // Agar aur JSON fields hain toh yahan add karein
    }));

    // 4. Update Cache
    experienceCache = parsedExperiences;
    cacheTimestamp = now;

    // 🟢 Success Response
    return res.status(200).json({
      success: true,
      total: parsedExperiences.length,
      experiences: parsedExperiences,
      cached: false,
    });
  } catch (error) {
    console.error("❌ Error in getExp:", error);
    return res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Internal Server Error!",
    });
  }
};
