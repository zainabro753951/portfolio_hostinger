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
    let newFileKey = ""; // Track newly uploaded local file for rollback

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

        // Type Conversions
        isUpdate = isUpdate === "true" || isUpdate === true;
        if (typeof aboutImageOBJ === "string") aboutImageOBJ = safeParse(aboutImageOBJ);
        if (typeof isAboutImageRemoved === "string") isAboutImageRemoved = safeParse(isAboutImageRemoved);

        // ✅ 1. Upload new file if provided (Local Storage)
        let uploadResult = null;
        if (req.file) {
            uploadResult = await uploadToLocal(req.file, "about");
            newFileKey = uploadResult?.key || "";
        }

        // ✅ 2. Merge image data
        const finalImageOBJ = {
            key: uploadResult?.key || (isAboutImageRemoved ? null : aboutImageOBJ?.key) || null,
            url: uploadResult?.url || (isAboutImageRemoved ? null : aboutImageOBJ?.url) || null,
        };

        if (isUpdate) {
            // Check if record exists
            const [existingAbout] = await pool.query("SELECT id, aboutImage FROM about LIMIT 1");
            
            if (existingAbout.length === 0) {
                if (newFileKey) await deleteFromLocal(newFileKey); // Rollback
                return res.status(404).json({
                    success: false,
                    errorCode: "ABOUT_NOT_FOUND",
                    message: "No record found to update.",
                });
            }

            const aboutId = existingAbout[0].id;

            // ✅ 3. Cleanup Old Files
            // Case A: Naya file upload hua -> Purana delete karo
            if (req.file && aboutImageOBJ?.key) {
                await deleteFromLocal(aboutImageOBJ.key).catch(err => console.error("Old file delete failed:", err));
            }
            // Case B: User ne image remove ki (lekin nayi upload nahi ki)
            else if (isAboutImageRemoved && aboutImageOBJ?.key) {
                await deleteFromLocal(aboutImageOBJ.key).catch(err => console.error("Remove file failed:", err));
            }

            // ✅ 4. Update Database
            const [updateResult] = await pool.query(
                "UPDATE about SET fullName = ?, shortRole = ?, shortDesc = ?, longDesc = ?, aboutImage = ? WHERE id = ?",
                [
                    fullName,
                    shortRole,
                    shortDesc,
                    longDesc,
                    JSON.stringify(finalImageOBJ.key ? finalImageOBJ : null),
                    aboutId,
                ]
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
            // ✅ 5. Insert New Record
            const [results] = await pool.query(
                "INSERT INTO about (fullName, shortRole, shortDesc, longDesc, aboutImage) VALUES (?, ?, ?, ?, ?)",
                [fullName, shortRole, shortDesc, longDesc, JSON.stringify(finalImageOBJ.key ? finalImageOBJ : null)]
            );

            if (results.affectedRows > 0) {
                await logActivity({
                    type: "ABOUT_ADD",
                    title: "About info added",
                    description: "Your About section is now live.",
                    ip: req.ip,
                    device: req.headers["user-agent"],
                });

                return res.status(201).json({
                    success: true,
                    message: "About successfully created.",
                });
            }
        }

        return res.status(400).json({ success: false, message: "No changes made." });

    } catch (error) {
        console.error("ADD_ABOUT_ERROR:", error);

        // ❌ Rollback: Agar DB fail ho jaye toh naya upload delete kar dein
        if (newFileKey) {
            await deleteFromLocal(newFileKey).catch(err => console.error("Rollback failed:", err));
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
};

export const getAbout = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM about LIMIT 1");
    const about = rows[0] || null;

    return res.status(200).json({
      success: true,
      successCode: "GET_ABOUT",
      message: "About fetched successfully.",
      about,
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
