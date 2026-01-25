import pool from "../db.config.js";
import { body } from "express-validator";

import { deleteFromLocal, uploadToLocal } from "../Utils/uploadToLocal.js";
import { safeParse } from "../Utils/SafeParser.js";
import { logActivity } from "../Utils/activityLogger.js";

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
  let newFileKey = ""; // Track new upload for rollback

  try {
    let {
      fullName,
      shortRole,
      shortDesc,
      longDesc,
      isUpdate,
      aboutImageOBJ,
      isAboutImageRemoved,
    } = req.body;

    // Type conversions
    isUpdate = isUpdate === "true" || isUpdate === true;
    if (typeof aboutImageOBJ === "string")
      aboutImageOBJ = safeParse(aboutImageOBJ);
    if (typeof isAboutImageRemoved === "string")
      isAboutImageRemoved = safeParse(isAboutImageRemoved);

    // ✅ 1. Upload new image if provided
    let uploadResult = null;
    if (req.file) {
      uploadResult = await uploadToLocal(req.file, "about");
      newFileKey = uploadResult?.key;
    }

    // ✅ 2. Determine final image object
    const finalImageOBJ = {
      key:
        uploadResult?.key ||
        (isAboutImageRemoved ? null : aboutImageOBJ?.key) ||
        null,
      url:
        uploadResult?.url ||
        (isAboutImageRemoved ? null : aboutImageOBJ?.url) ||
        null,
    };

    if (isUpdate) {
      // 🔹 Fetch existing record
      const [existing] = await pool.query(
        "SELECT id, aboutImage FROM about LIMIT 1",
      );
      if (!existing.length) {
        if (newFileKey) await deleteFromLocal(newFileKey);
        return res
          .status(404)
          .json({ success: false, message: "No record found to update." });
      }

      const aboutId = existing[0].id;
      const oldImageOBJ = existing[0].aboutImage
        ? JSON.parse(existing[0].aboutImage)
        : null;

      // 🔹 3. Delete old image if needed
      // Case A: New upload replaces old
      if (uploadResult && oldImageOBJ?.key) {
        await deleteFromLocal(oldImageOBJ.key).catch(console.error);
      }
      // Case B: User removed old image
      else if (isAboutImageRemoved && oldImageOBJ?.key) {
        await deleteFromLocal(oldImageOBJ.key).catch(console.error);
      }

      // 🔹 4. Update DB
      const [updateResult] = await pool.query(
        "UPDATE about SET fullName=?, shortRole=?, shortDesc=?, longDesc=?, aboutImage=? WHERE id=?",
        [
          fullName,
          shortRole,
          shortDesc,
          longDesc,
          finalImageOBJ.key ? JSON.stringify(finalImageOBJ) : null,
          aboutId,
        ],
      );

      if (updateResult.affectedRows > 0) {
        await logActivity({
          type: "ABOUT_UPDATE",
          title: "About info updated",
          description: "You’ve just updated the About section.",
          ip: req.ip,
          device: req.headers["user-agent"],
        });
        return res.status(200).json({
          success: true,
          message: "About section updated successfully.",
        });
      }
    } else {
      // 🔹 5. Insert new record
      const [results] = await pool.query(
        "INSERT INTO about (fullName, shortRole, shortDesc, longDesc, aboutImage) VALUES (?, ?, ?, ?, ?)",
        [
          fullName,
          shortRole,
          shortDesc,
          longDesc,
          finalImageOBJ.key ? JSON.stringify(finalImageOBJ) : null,
        ],
      );

      if (results.affectedRows > 0) {
        await logActivity({
          type: "ABOUT_ADD",
          title: "About info added",
          description: "Your About section is now live.",
          ip: req.ip,
          device: req.headers["user-agent"],
        });
        return res
          .status(201)
          .json({ success: true, message: "About successfully created." });
      }
    }

    return res
      .status(400)
      .json({ success: false, message: "No changes made." });
  } catch (error) {
    console.error("ADD_ABOUT_ERROR:", error);
    if (newFileKey) await deleteFromLocal(newFileKey).catch(console.error); // rollback new upload
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
};

export const getAbout = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM about LIMIT 1");
    const about = rows[0] || null;

    console.log(about);

    return res.status(200).json({
      success: true,
      successCode: "GET_ABOUT",
      message: "About fetched successfully.",
      about: {
        ...about,
        aboutImage: JSON.parse(about.aboutImage),
      },
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
