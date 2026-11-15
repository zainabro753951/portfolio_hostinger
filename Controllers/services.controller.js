import { body, validationResult } from "express-validator";
import pool from "../db.config.js";
import { deleteFromLocal, uploadToLocal } from "../Utils/uploadToLocal.js"; // Updated Helpers
import {
  safeParse,
  parseJSONArray,
  normalizeBool,
} from "../Utils/SafeParser.js";
import { uploadFile } from "../Utils/uploadToCloudinary.js";
import { deleteFromCloudinary } from "../Utils/deleteFromCloudinary.js";

// ── Helper: Parse stored image safely ────────────────────────────
const parseServiceImage = (value) => {
  if (!value) return null;

  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;

    if (!parsed || typeof parsed !== "object") return null;

    if (!parsed.key || !parsed.url) return null;

    return {
      key: parsed.key,
      url: parsed.url,
      resource_type: parsed.resource_type || "image",
    };
  } catch {
    return null;
  }
};

// ── Helper: Safely delete Cloudinary image ───────────────────────
const cleanupServiceImage = async (image) => {
  if (!image?.key) return;

  try {
    const result = await deleteFromCloudinary({
      key: image.key,
      resource_type: image.resource_type || "image",
    });

    if (!result?.success) {
      console.error(
        "⚠️ Cloudinary image cleanup failed:",
        result?.error || "Unknown deletion error",
      );
      return;
    }

    console.log("🗑️ Cloudinary image deleted:", image.key);
  } catch (error) {
    console.error("⚠️ Cloudinary cleanup error:", error?.message || error);
  }
};

export const serviceValidations = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title must be at most 200 characters"),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),

  body("shortDescription")
    .trim()
    .notEmpty()
    .withMessage("Short description is required")
    .isLength({ max: 500 })
    .withMessage("Short description must be at most 500 characters"),

  body("fullDescription")
    .trim()
    .notEmpty()
    .withMessage("Full description is required"),

  body("category").notEmpty().withMessage("Category is required"),

  body("status")
    .optional()
    .isIn(["draft", "active", "inactive"])
    .withMessage("Status must be draft, active, or inactive"),

  body("isFeatured")
    .optional()
    .custom((value) => {
      const normalized = value === "true" || value === true;
      return normalized === true || normalized === false;
    })
    .withMessage("isFeatured must be a boolean"),
];

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errorCode: "VALIDATION_ERROR",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};

// ── ADD / UPDATE SERVICE ─────────────────────────────────────────
export const addService = async (req, res) => {
  let newUploadedImage = null;
  let databaseUpdated = false;

  try {
    // ── 1. Extract request body ──────────────────────────────────
    let {
      serviceId,
      isUpdate,
      serviceImageOBJ,
      title,
      slug,
      shortDescription,
      fullDescription,
      category,
      techStack,
      features,
      deliveryTime,
      status,
      isFeatured,
      seoMetaTitle,
      seoMetaDescription,
      seoKeywords,
    } = req.body;

    // ── 2. Normalize values ──────────────────────────────────────
    isUpdate = normalizeBool(isUpdate);
    isFeatured = normalizeBool(isFeatured);

    const existingImage = parseServiceImage(serviceImageOBJ);

    const techStackArr = parseJSONArray(techStack);
    const featuresArr = parseJSONArray(features);
    const seoKeywordsArr = parseJSONArray(seoKeywords);

    const normalizedStatus = status || "draft";

    // ── 3. Validate request ──────────────────────────────────────
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errorCode: "VALIDATION_ERROR",
        errors: errors.array(),
      });
    }

    // ── 4. Validate update ID ────────────────────────────────────
    if (isUpdate) {
      serviceId = Number(serviceId);

      if (!Number.isInteger(serviceId) || serviceId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid service ID!",
        });
      }
    }

    // ── 5. Validate uploaded image ───────────────────────────────
    if (req.file && !req.file.mimetype?.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed for service images.",
      });
    }

    // ── 6. Check existing service during update ──────────────────
    let oldImage = null;

    if (isUpdate) {
      const [existing] = await pool.query(
        "SELECT id, serviceImage FROM services WHERE id = ? LIMIT 1",
        [serviceId],
      );

      if (!existing.length) {
        return res.status(404).json({
          success: false,
          message: "Service not found!",
        });
      }

      oldImage = parseServiceImage(existing[0].serviceImage);
    }

    // ── 7. Check duplicate title / slug ──────────────────────────
    const duplicateQuery = isUpdate
      ? `SELECT id FROM services
         WHERE (title = ? OR slug = ?)
         AND id != ?
         LIMIT 1`
      : `SELECT id FROM services
         WHERE title = ? OR slug = ?
         LIMIT 1`;

    const duplicateParams = isUpdate ? [title, slug, serviceId] : [title, slug];

    const [duplicates] = await pool.query(duplicateQuery, duplicateParams);

    if (duplicates.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Service with this title or slug already exists!",
      });
    }

    // ── 8. Upload new image to Cloudinary ─────────────────────────
    if (req.file) {
      newUploadedImage = await uploadFile(req.file, "services");

      if (!newUploadedImage?.key || !newUploadedImage?.url) {
        throw new Error("Service image upload failed.");
      }
    }

    // ── 9. Prepare final image object ─────────────────────────────
    // New upload > existing database image > null
    const finalImage = newUploadedImage
      ? {
          key: newUploadedImage.key,
          url: newUploadedImage.url,
          resource_type: newUploadedImage.resource_type || "image",
        }
      : oldImage || existingImage || null;

    const serviceImageValue = finalImage ? JSON.stringify(finalImage) : null;

    // ── 10. UPDATE SERVICE ───────────────────────────────────────
    if (isUpdate) {
      await pool.query(
        `UPDATE services SET
          title = ?,
          slug = ?,
          shortDescription = ?,
          fullDescription = ?,
          category = ?,
          techStack = ?,
          features = ?,
          deliveryTime = ?,
          serviceImage = ?,
          status = ?,
          isFeatured = ?,
          seoMetaTitle = ?,
          seoMetaDescription = ?,
          seoKeywords = ?
        WHERE id = ?`,
        [
          title,
          slug,
          shortDescription,
          fullDescription,
          category,
          JSON.stringify(techStackArr),
          JSON.stringify(featuresArr),
          deliveryTime || null,
          serviceImageValue,
          normalizedStatus,
          isFeatured ? 1 : 0,
          seoMetaTitle || null,
          seoMetaDescription || null,
          JSON.stringify(seoKeywordsArr),
          serviceId,
        ],
      );

      databaseUpdated = true;

      // Delete old image only after successful database update.
      if (
        newUploadedImage &&
        oldImage?.key &&
        oldImage.key !== newUploadedImage.key
      ) {
        await cleanupServiceImage(oldImage);
      }

      return res.status(200).json({
        success: true,
        message: "Service updated successfully!",
        data: {
          id: serviceId,
          serviceImage: finalImage,
        },
      });
    }

    // ── 11. INSERT NEW SERVICE ───────────────────────────────────
    const [insertResult] = await pool.query(
      `INSERT INTO services (
        title,
        slug,
        shortDescription,
        fullDescription,
        category,
        techStack,
        features,
        deliveryTime,
        serviceImage,
        status,
        isFeatured,
        seoMetaTitle,
        seoMetaDescription,
        seoKeywords
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        shortDescription,
        fullDescription,
        category,
        JSON.stringify(techStackArr),
        JSON.stringify(featuresArr),
        deliveryTime || null,
        serviceImageValue,
        normalizedStatus,
        isFeatured ? 1 : 0,
        seoMetaTitle || null,
        seoMetaDescription || null,
        JSON.stringify(seoKeywordsArr),
      ],
    );

    databaseUpdated = true;

    return res.status(201).json({
      success: true,
      message: "Service added successfully!",
      data: {
        id: insertResult.insertId,
        serviceImage: finalImage,
      },
    });
  } catch (error) {
    console.error("❌ Service Controller Error:", error);

    // ── 12. Rollback newly uploaded image if DB operation failed ─
    if (newUploadedImage && !databaseUpdated) {
      await cleanupServiceImage(newUploadedImage);
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error:
        process.env.NODE_ENV === "development"
          ? error?.message || "Unknown error"
          : undefined,
    });
  }
};

export const deleteServices = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Find service and its image
    const [rows] = await pool.query(
      "SELECT serviceImage FROM services WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Service not found!",
      });
    }

    // 2. Parse Cloudinary image data
    const imgData =
      typeof rows[0].serviceImage === "string"
        ? safeParse(rows[0].serviceImage)
        : rows[0].serviceImage;

    // 3. Delete image from Cloudinary first
    if (imgData?.key) {
      const deleteResult = await deleteFromCloudinary({
        key: imgData.key,
        resource_type: imgData.resource_type || "image",
      });

      if (!deleteResult?.success) {
        console.error("Cloudinary image deletion failed:", deleteResult?.error);

        return res.status(500).json({
          success: false,
          message: "Unable to delete service image. Service was not deleted.",
        });
      }
    }

    // 4. Delete service from database
    await pool.query("DELETE FROM services WHERE id = ?", [id]);

    return res.status(200).json({
      success: true,
      message: "Service and its image deleted successfully!",
    });
  } catch (error) {
    console.error("DELETE_SERVICE_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// Controller: Get all Services
export const getServices = async (req, res) => {
  try {
    // 🧠 Fetch data from DB (ordered by most recent first)
    const [rows] = await pool.query(
      `
      SELECT * FROM services ORDER BY createdAt DESC
      `,
    );

    // 🟢 Success Response
    return res.status(200).json({
      success: true,
      total: rows.length,
      services: rows,
    });
  } catch (error) {
    console.error("Error in Get Services:", error);
    return res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Internal Server Error!",
    });
  }
};
