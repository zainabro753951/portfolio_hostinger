import { body, validationResult } from "express-validator";
import pool from "../db.config.js";
import { deleteFromLocal, uploadToLocal } from "../Utils/uploadToLocal.js"; // Updated Helpers
import {
  safeParse,
  parseJSONArray,
  extractValues,
  normalizeBool,
  normalizeNumber,
} from "../Utils/SafeParser.js";

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
  // ── Extract all fields from req.body ───────────────────────────
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

  console.log(req.body);
  console.log(req.file);

  // ── Type Casting & Parsing ─────────────────────────────────────
  isUpdate = normalizeBool(isUpdate);
  serviceImageOBJ = safeParse(serviceImageOBJ);

  // Parse JSON arrays from FormData
  const techStackArr = parseJSONArray(techStack);
  const featuresArr = parseJSONArray(features);
  const seoKeywordsArr = parseJSONArray(seoKeywords);

  console.log(techStackArr);

  // Normalize other fields
  const normalizedStatus = status || "draft";
  const normalizedFeatured = normalizeBool(isFeatured);

  let newFileKey = ""; // Track for rollback

  try {
    // ── 1. Validation Check ──────────────────────────────────────
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errorCode: "VALIDATION_ERROR",
        errors: errors.array(),
      });
    }

    // ── 2. Upload Image if provided ──────────────────────────────
    let uploadResult = null;
    if (req.file) {
      uploadResult = await uploadToLocal(req.file, "services");
      newFileKey = uploadResult?.key || "";
    }

    const finalImageObj = {
      key: uploadResult?.key || serviceImageOBJ?.key || null,
      url: uploadResult?.url || serviceImageOBJ?.url || null,
    };

    // ═════════════════════════════════════════════════════════════
    // UPDATE LOGIC
    // ═════════════════════════════════════════════════════════════
    if (isUpdate && serviceId) {
      serviceId = parseInt(serviceId, 10);
      if (isNaN(serviceId)) {
        if (newFileKey) await deleteFromLocal(newFileKey);
        return res.status(400).json({
          success: false,
          message: "Invalid service ID!",
        });
      }

      // Check if service exists
      const [existing] = await pool.query(
        "SELECT serviceImage FROM services WHERE id = ?",
        [serviceId],
      );

      if (existing.length === 0) {
        if (newFileKey) await deleteFromLocal(newFileKey);
        return res.status(404).json({
          success: false,
          message: "Service not found!",
        });
      }

      // Cleanup old image if replaced
      if (req.file && existing[0].serviceImage) {
        const oldImg = safeParse(existing[0].serviceImage);
        if (oldImg?.key && oldImg.key !== newFileKey) {
          await deleteFromLocal(oldImg.key).catch((e) =>
            console.warn("⚠️ Old image delete failed:", e.message),
          );
        }
      }

      // ── UPDATE DATABASE ────────────────────────────────────────
      await pool.query(
        `UPDATE services 
         SET 
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
          JSON.stringify(finalImageObj.key ? finalImageObj : null),
          normalizedStatus,
          normalizedFeatured ? 1 : 0,
          seoMetaTitle || null,
          seoMetaDescription || null,
          JSON.stringify(seoKeywordsArr),
          serviceId,
        ],
      );

      return res.status(200).json({
        success: true,
        message: "Service updated successfully!",
        data: { id: serviceId },
      });
    }

    // ═════════════════════════════════════════════════════════════
    // INSERT LOGIC
    // ═════════════════════════════════════════════════════════════

    // Check duplicate title
    const [duplicate] = await pool.query(
      "SELECT id FROM services WHERE title = ? OR slug = ?",
      [title, slug],
    );

    if (duplicate.length > 0) {
      if (newFileKey) await deleteFromLocal(newFileKey);
      return res.status(409).json({
        success: false,
        message: "Service with this title or slug already exists!",
      });
    }

    // ── INSERT INTO DATABASE ───────────────────────────────────
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
        JSON.stringify(finalImageObj.key ? finalImageObj : null),
        normalizedStatus,
        normalizedFeatured ? 1 : 0,
        seoMetaTitle || null,
        seoMetaDescription || null,
        JSON.stringify(seoKeywordsArr),
      ],
    );

    return res.status(201).json({
      success: true,
      message: "Service added successfully!",
      data: { id: insertResult.insertId },
    });
  } catch (error) {
    console.error("❌ Service Controller Error:", error);

    // Rollback: delete uploaded file on crash
    if (newFileKey) {
      await deleteFromLocal(newFileKey).catch((e) =>
        console.warn("⚠️ Rollback delete failed:", e.message),
      );
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const deleteServices = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT serviceImage FROM services WHERE id = ?",
      [id],
    );
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Service not found!" });

    // Delete image from local storage
    const imgData =
      typeof rows[0].serviceImage === "string"
        ? safeParse(rows[0].serviceImage)
        : rows[0].serviceImage;
    if (imgData?.key) {
      await deleteFromLocal(imgData.key).catch((e) =>
        console.error("File delete failed", e),
      );
    }

    await pool.query("DELETE FROM services WHERE id = ?", [id]);
    return res
      .status(200)
      .json({ success: true, message: "Service deleted successfully!" });
  } catch (error) {
    console.error("DELETE_SERVICE_ERROR:", error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
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
