import { body, validationResult } from "express-validator";
import pool from "../db.config.js";
import { deleteFromLocal, uploadToLocal } from "../Utils/uploadToLocal.js"; // Updated Helpers
import { safeParse } from "../Utils/SafeParser.js";

export const serviceValidations = [
  body("title").trim().notEmpty().withMessage("Title is required"),

  body("shortDesc")
    .trim()
    .notEmpty()
    .withMessage("Service description is required"),

  body("category").notEmpty().withMessage("Category is required"),
];

export const addService = async (req, res) => {
  let {
    serviceId,
    isUpdate,
    serviceImageOBJ,
    title,
    shortDesc,
    status,
    category,
  } = req.body;

  // Type Casting & Parsing
  isUpdate = isUpdate === "true" || isUpdate === true;
  serviceImageOBJ =
    typeof serviceImageOBJ === "string"
      ? safeParse(serviceImageOBJ)
      : serviceImageOBJ;

  let newFileKey = ""; // Track for rollback

  try {
    // 1. Validation Check (Early Return)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errorCode: "VALIDATION_ERROR",
        errors: errors.array(),
      });
    }

    // 2. Upload Image if provided (Local)
    let uploadResult = null;
    if (req.file) {
      uploadResult = await uploadToLocal(req.file, "services");
      newFileKey = uploadResult?.key;
    }

    const finalImageObj = {
      key: uploadResult?.key || serviceImageOBJ?.key || null,
      url: uploadResult?.url || serviceImageOBJ?.url || null,
    };

    // --- UPDATE LOGIC ---
    if (isUpdate && serviceId) {
      const [existing] = await pool.query(
        "SELECT serviceImage FROM services WHERE id = ?",
        [serviceId],
      );

      if (existing.length === 0) {
        if (newFileKey) await deleteFromLocal(newFileKey);
        return res
          .status(404)
          .json({ success: false, message: "Service not found!" });
      }

      // Cleanup old image if replaced
      if (req.file) {
        const oldImg =
          typeof existing[0].serviceImage === "string"
            ? safeParse(existing[0].serviceImage)
            : existing[0].serviceImage;
        if (oldImg?.key) {
          await deleteFromLocal(oldImg.key).catch((e) =>
            console.warn("Old image delete failed", e),
          );
        }
      }

      await pool.query(
        `UPDATE services SET title=?, shortDesc=?, category=?, serviceImage=?, status=?, updatedAt=NOW() WHERE id=?`,
        [
          title,
          shortDesc,
          category,
          JSON.stringify(finalImageObj.key ? finalImageObj : null),
          status || "draft",
          serviceId,
        ],
      );

      return res
        .status(200)
        .json({ success: true, message: "Service updated successfully!" });
    }

    // --- INSERT LOGIC ---
    // Check duplicate title
    const [duplicate] = await pool.query(
      "SELECT id FROM services WHERE title = ?",
      [title],
    );
    if (duplicate.length > 0) {
      if (newFileKey) await deleteFromLocal(newFileKey);
      return res
        .status(409)
        .json({ success: false, message: "Service title already exists!" });
    }

    const [insertResult] = await pool.query(
      "INSERT INTO services (title, shortDesc, category, serviceImage, status) VALUES (?, ?, ?, ?, ?)",
      [
        title,
        shortDesc,
        category,
        JSON.stringify(finalImageObj.key ? finalImageObj : null),
        status || "draft",
      ],
    );

    res
      .status(201)
      .json({ success: true, message: "Service added successfully!" });
  } catch (error) {
    console.error("❌ Service Controller Error:", error);
    if (newFileKey) await deleteFromLocal(newFileKey); // Rollback on crash
    res.status(500).json({ success: false, message: "Internal Server Error!" });
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
