import pool from "../db.config.js";
import { body, validationResult } from "express-validator";
import { deleteFromLocal, uploadToLocal } from "../Utils/uploadToLocal.js"; // Updated Helper
import { parseBoolean, safeParse } from "../Utils/SafeParser.js";
import { uploadFile } from "../Utils/uploadToCloudinary.js";
import { deleteFromCloudinary } from "../Utils/deleteFromCloudinary.js";

export const AddEducationValidation = [
  body("institutionName")
    .notEmpty()
    .withMessage("Institution name is required!"),

  body("degree").notEmpty().withMessage("Degree is required!"),

  body("fieldStudy").notEmpty().withMessage("Field of study is required!"),

  body("startYear").notEmpty().withMessage("Start year is required!"),

  body("location").notEmpty().withMessage("Location is required!"),

  body("eduDesc").notEmpty().withMessage("Education description is required!"),
];

export const addEducation = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  let {
    institutionName,
    degree,
    fieldStudy,
    grade = null,
    startYear,
    endYear = null,
    location = null,
    eduDesc = null,
    isCurrentlyStudying,
    isUpdate,
    educationId,
  } = req.body;

  isUpdate = parseBoolean(isUpdate);

  isCurrentlyStudying = parseBoolean(isCurrentlyStudying);

  // Normalize values
  startYear = Number(startYear);

  if (isCurrentlyStudying) {
    endYear = null;
  } else if (endYear === "" || endYear === undefined) {
    endYear = null;
  } else {
    endYear = Number(endYear);
  }

  let newFile = null;
  let oldFile = null;
  let databaseUpdated = false;

  try {
    // 1. Basic year validation
    const currentYear = new Date().getFullYear();

    if (
      !Number.isInteger(startYear) ||
      startYear < 1900 ||
      startYear > currentYear
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid start year.",
      });
    }

    if (
      !isCurrentlyStudying &&
      endYear !== null &&
      (!Number.isInteger(endYear) ||
        endYear < startYear ||
        endYear > currentYear)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid end year.",
      });
    }

    if (!isCurrentlyStudying && endYear === null) {
      return res.status(400).json({
        success: false,
        message: "End year is required for completed education.",
      });
    }

    // 2. Fetch existing record during update
    let existingEducation = null;

    if (isUpdate) {
      if (!educationId) {
        return res.status(400).json({
          success: false,
          message: "Education ID is required.",
        });
      }

      const [rows] = await pool.query("SELECT * FROM education WHERE id = ?", [
        educationId,
      ]);

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: "Education record not found.",
        });
      }

      existingEducation = rows[0];

      oldFile =
        typeof existingEducation.certificate === "string"
          ? safeParse(existingEducation.certificate)
          : existingEducation.certificate;
    }

    // 3. Duplicate check
    const [duplicates] = await pool.query(
      `SELECT id FROM education
       WHERE degree = ?
       AND fieldStudy = ?
       AND institutionName = ?
       AND (? = 0 OR id != ?)`,
      [degree, fieldStudy, institutionName, isUpdate ? 1 : 0, educationId || 0],
    );

    if (duplicates.length > 0) {
      return res.status(400).json({
        success: false,
        message: "This education entry already exists!",
      });
    }

    // 4. Upload optional certificate to Cloudinary
    if (req.file) {
      const result = await uploadFile(req.file, "education");

      newFile = result;

      if (!newFile?.key || !newFile?.url) {
        throw new Error("Certificate upload failed.");
      }
    }

    // 5. Build final certificate
    const finalCertificate = newFile
      ? {
          key: newFile.key,
          url: newFile.url,
          resource_type: newFile.resource_type,
        }
      : oldFile?.key
        ? oldFile
        : null;

    const certificateValue = finalCertificate
      ? JSON.stringify(finalCertificate)
      : null;

    // 6. Update existing education
    if (isUpdate) {
      await pool.query(
        `UPDATE education SET
          institutionName = ?,
          degree = ?,
          fieldStudy = ?,
          grade = ?,
          startYear = ?,
          endYear = ?,
          isCurrentlyStudying = ?,
          location = ?,
          eduDesc = ?,
          certificate = ?
        WHERE id = ?`,
        [
          institutionName,
          degree,
          fieldStudy,
          grade,
          startYear,
          endYear,
          isCurrentlyStudying ? 1 : 0,
          location,
          eduDesc,
          certificateValue,
          educationId,
        ],
      );

      databaseUpdated = true;

      // Delete old certificate only after DB update succeeds
      if (newFile && oldFile?.key) {
        try {
          await deleteFromCloudinary({
            key: oldFile.key,
            resource_type: oldFile.resource_type || "image",
          });
        } catch (cleanupError) {
          console.error("Old certificate cleanup failed:", cleanupError);
        }
      }

      return res.status(200).json({
        success: true,
        message: "Education updated successfully.",
      });
    }

    // 7. Insert new education
    await pool.query(
      `INSERT INTO education (
        institutionName,
        degree,
        fieldStudy,
        grade,
        startYear,
        endYear,
        isCurrentlyStudying,
        location,
        eduDesc,
        certificate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        institutionName,
        degree,
        fieldStudy,
        grade,
        startYear,
        endYear,
        isCurrentlyStudying ? 1 : 0,
        location,
        eduDesc,
        certificateValue,
      ],
    );

    databaseUpdated = true;

    return res.status(201).json({
      success: true,
      message: "Education registered successfully.",
    });
  } catch (error) {
    console.error("Education Controller Error:", error);

    // Rollback only the newly uploaded file
    if (newFile && !databaseUpdated) {
      try {
        await deleteFromCloudinary({
          key: newFile.key,
          resource_type: newFile.resource_type || "image",
        });
      } catch (cleanupError) {
        console.error("New certificate rollback failed:", cleanupError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

export const deleteEducation = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Fetch education record
    const [rows] = await pool.query(
      "SELECT certificate FROM education WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Education record not found!",
      });
    }

    // 2. Parse certificate JSON
    const certificate =
      typeof rows[0].certificate === "string"
        ? safeParse(rows[0].certificate)
        : rows[0].certificate;

    // 3. Delete education record from database
    await pool.query("DELETE FROM education WHERE id = ?", [id]);

    // 4. Delete certificate from Cloudinary (if exists)
    let cleanupSuccess = true;

    if (certificate?.key) {
      const result = await deleteFromCloudinary({
        key: certificate.key,
        resource_type: certificate.resource_type || "image",
      });

      if (!result.success) {
        cleanupSuccess = false;

        console.error("Education certificate deletion failed:", result.error);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Education deleted successfully!",
      certificateDeleted: cleanupSuccess,
    });
  } catch (error) {
    console.error("Delete Education Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getEducation = async (req, res) => {
  try {
    const [education] = await pool.query("SELECT * FROM education");

    return res.status(200).json({
      success: true,
      successCode: "GET_EDUCATION",
      message: "Education fetched successfully.",
      education,
    });
  } catch (error) {
    console.error("GET_EDUCATION_ERROR:", error);

    return res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Internal Server Error!",
    });
  }
};
