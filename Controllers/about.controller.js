import { body } from "express-validator";
import pool from "../db.config.js";

import { parseBoolean, parseObject, parseStoredImage, safeParse } from "../Utils/SafeParser.js";
import { logActivity } from "../Utils/activityLogger.js";
import { deleteFromLocal, uploadToLocal } from "../Utils/uploadToLocal.js";
import { safeParseJSON } from "../Utils/safeParseJSON.js";
import { uploadFile } from "../Utils/uploadToCloudinary.js";
import { rollbackUploads } from "../Utils/deleteFromCloudinary.js";

export const AddAboutValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),

  body("shortRole").trim().notEmpty().withMessage("Role is required"),

  body("shortDesc")
    .trim()
    .notEmpty()
    .withMessage("Short description is required"),

  body("longDesc")
    .trim()
    .notEmpty()
    .withMessage("Long description is required"),
];

export const AddAbout = async (req, res) => {
  // Track every newly uploaded file for rollback
  const uploadedPublicIds = [];

  // Keep old assets until database operation succeeds
  let oldPublicIds = [];

  let dbCommitted = false;

  try {
    let {
      fullName,
      shortRole,
      successNote,
      experience,
      shortDesc,
      longDesc,
      isUpdate,
      aboutImageOBJ,
      poseImageOBJ,
      resumeOBJ,
      isAboutImageRemoved,
      isPoseImageRemoved,
      isResumeRemoved,
    } = req.body;

    // Convert FormData values
    isUpdate = parseBoolean(isUpdate);

    aboutImageOBJ = parseObject(aboutImageOBJ);
    poseImageOBJ = parseObject(poseImageOBJ);
    resumeOBJ = parseObject(resumeOBJ);

    isAboutImageRemoved = parseBoolean(isAboutImageRemoved);
    isPoseImageRemoved = parseBoolean(isPoseImageRemoved);
    isResumeRemoved = parseBoolean(isResumeRemoved);

    // Get uploaded files from Multer
    const aboutFile = req.files?.aboutImage?.[0];
    const poseFile = req.files?.poseImage?.[0];
    const resumeFile = req.files?.resume?.[0];

    // Resume must be a PDF
    if (resumeFile && resumeFile.mimetype !== "application/pdf") {
      return res.status(400).json({
        success: false,
        message: "Only PDF resume files are allowed.",
      });
    }

    // ==========================================
    // 1. UPLOAD ABOUT IMAGE
    // ==========================================

    let uploadResult = null;

    if (aboutFile) {
      uploadResult = await uploadFile(aboutFile, "about");

      uploadedPublicIds.push(uploadResult.key);
    }

    // ==========================================
    // 2. UPLOAD POSE IMAGE
    // ==========================================

    let uploadPoseImageResult = null;

    if (poseFile) {
      uploadPoseImageResult = await uploadFile(poseFile, "about");

      uploadedPublicIds.push(uploadPoseImageResult.key);
    }

    // ==========================================
    // 3. UPLOAD RESUME PDF
    // ==========================================

    let uploadResumeResult = null;

    if (resumeFile) {
      uploadResumeResult = await uploadFile(resumeFile, "about");

      uploadedPublicIds.push(uploadResumeResult.key);
    }

    // ==========================================
    // 4. FINAL IMAGE OBJECTS
    // ==========================================

    const finalImageOBJ = uploadResult
      ? {
          key: uploadResult.key,
          url: uploadResult.url,
        }
      : isAboutImageRemoved
        ? null
        : aboutImageOBJ?.key
          ? aboutImageOBJ
          : null;

    const finalPoseImageOBJ = uploadPoseImageResult
      ? {
          key: uploadPoseImageResult.key,
          url: uploadPoseImageResult.url,
        }
      : isPoseImageRemoved
        ? null
        : poseImageOBJ?.key
          ? poseImageOBJ
          : null;

    const finalResumeOBJ = uploadResumeResult
      ? {
          key: uploadResumeResult.key,
          url: uploadResumeResult.url,
        }
      : isResumeRemoved
        ? null
        : resumeOBJ?.key
          ? resumeOBJ
          : null;

    // ==========================================
    // 5. UPDATE EXISTING ABOUT RECORD
    // ==========================================

    if (isUpdate) {
      const [existing] = await pool.query(
        `SELECT id, aboutImage, poseImage, resume
         FROM about
         LIMIT 1`,
      );

      if (!existing.length) {
        await rollbackUploads(uploadedPublicIds);

        return res.status(404).json({
          success: false,
          message: "No record found to update.",
        });
      }

      const existingRecord = existing[0];

      const oldImageOBJ = parseStoredImage(existingRecord.aboutImage);

      const oldPoseImageOBJ = parseStoredImage(existingRecord.poseImage);

      const oldResumeOBJ = parseStoredImage(existingRecord.resume);

      // Collect old public IDs for deletion after DB update
      if (oldImageOBJ?.key && (uploadResult || isAboutImageRemoved)) {
        oldPublicIds.push(oldImageOBJ.key);
      }

      if (
        oldPoseImageOBJ?.key &&
        (uploadPoseImageResult || isPoseImageRemoved)
      ) {
        oldPublicIds.push(oldPoseImageOBJ.key);
      }

      if (oldResumeOBJ?.key && (uploadResumeResult || isResumeRemoved)) {
        oldPublicIds.push(oldResumeOBJ.key);
      }

      const [updateResult] = await pool.query(
        `UPDATE about SET
          fullName = ?,
          shortRole = ?,
          successNote = ?,
          experience = ?,
          shortDesc = ?,
          longDesc = ?,
          aboutImage = ?,
          poseImage = ?,
          resume = ?
         WHERE id = ?`,
        [
          fullName,
          shortRole,
          successNote,
          experience,
          shortDesc,
          longDesc,
          finalImageOBJ ? JSON.stringify(finalImageOBJ) : null,
          finalPoseImageOBJ ? JSON.stringify(finalPoseImageOBJ) : null,
          finalResumeOBJ ? JSON.stringify(finalResumeOBJ) : null,
          existingRecord.id,
        ],
      );

      if (updateResult.affectedRows === 0) {
        // Same values can also produce zero affected rows.
        // Verify the record still exists.
        const [check] = await pool.query(
          "SELECT id FROM about WHERE id = ? LIMIT 1",
          [existingRecord.id],
        );

        if (!check.length) {
          throw new Error("About record update failed.");
        }
      }

      // Database successfully updated
      dbCommitted = true;

      // ==========================================
      // 6. DELETE OLD FILES
      // ==========================================

      if (oldPublicIds.length) {
        await rollbackUploads(
          oldPublicIds.filter((id) => !uploadedPublicIds.includes(id)),
        );
      }

      // Activity logging should not break a successful update
      try {
        await logActivity({
          type: "ABOUT_UPDATE",
          title: "About info updated",
          description: "You've just updated the About section.",
          ip: req.ip,
          device: req.headers["user-agent"],
        });
      } catch (logError) {
        console.error("ABOUT_ACTIVITY_LOG_ERROR:", logError);
      }

      return res.status(200).json({
        success: true,
        message: "About section updated successfully.",
      });
    }

    // ==========================================
    // 7. CREATE NEW ABOUT RECORD
    // ==========================================

    const [results] = await pool.query(
      `INSERT INTO about
        (
          fullName,
          shortRole,
          successNote,
          experience,
          shortDesc,
          longDesc,
          aboutImage,
          poseImage,
          resume
        )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fullName,
        shortRole,
        successNote,
        experience,
        shortDesc,
        longDesc,
        finalImageOBJ ? JSON.stringify(finalImageOBJ) : null,
        finalPoseImageOBJ ? JSON.stringify(finalPoseImageOBJ) : null,
        finalResumeOBJ ? JSON.stringify(finalResumeOBJ) : null,
      ],
    );

    if (!results.affectedRows) {
      throw new Error("About record creation failed.");
    }

    dbCommitted = true;

    try {
      await logActivity({
        type: "ABOUT_ADD",
        title: "About info added",
        description: "Your About section is now live.",
        ip: req.ip,
        device: req.headers["user-agent"],
      });
    } catch (logError) {
      console.error("ABOUT_ACTIVITY_LOG_ERROR:", logError);
    }

    return res.status(201).json({
      success: true,
      message: "About successfully created.",
    });
  } catch (error) {
    console.error("ADD_ABOUT_ERROR:", error);

    // Rollback only if DB operation has not committed
    if (!dbCommitted) {
      await rollbackUploads(uploadedPublicIds);
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getAbout = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM about LIMIT 1");

    const about = rows[0];

    return res.status(200).json({
      success: true,
      successCode: "GET_ABOUT",
      message: "About fetched successfully.",
      about: about
        ? {
            ...about,
            aboutImage: safeParseJSON(about.aboutImage),
            poseImage: safeParseJSON(about.poseImage),
          }
        : null,
    });
  } catch (error) {
    console.error("GET_ABOUT_ERROR:", error);

    return res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Internal Server Error!",
    });
  }
};
