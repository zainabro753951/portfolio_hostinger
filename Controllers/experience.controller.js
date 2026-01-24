import pool from "../db.config.js";
import { validationResult, body } from "express-validator";
import { deleteFromLocal, uploadToLocal } from "../Utils/uploadToLocal.js"; // Local Storage Helpers
import { safeParse } from "../Utils/SafeParser.js";

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
    companyLogoOBJ,
  } = req.body;

  // Type Casting
  isUpdate = isUpdate === "true" || isUpdate === true;
  const isCurrentlyWorking =
    currentlyWorking === "true" || currentlyWorking === true;
  const normalizedEndDate = isCurrentlyWorking ? null : endDate;
  companyLogoOBJ =
    typeof companyLogoOBJ === "string"
      ? safeParse(companyLogoOBJ)
      : companyLogoOBJ;

  let newFileKey = ""; // Tracking for rollback

  try {
    // 1. Upload Logo if provided
    let uploadResult = null;
    if (req.file) {
      uploadResult = await uploadToLocal(req.file, "experience");
      newFileKey = uploadResult?.key;
    }

    const finalLogoOBJ = {
      url: uploadResult?.url || (isUpdate ? companyLogoOBJ?.url : null),
      key: uploadResult?.key || (isUpdate ? companyLogoOBJ?.key : null),
    };

    if (isUpdate && expId) {
      // 2. Cleanup Old Logo if new one is uploaded
      if (req.file && companyLogoOBJ?.key) {
        await deleteFromLocal(companyLogoOBJ.key).catch((e) =>
          console.warn("Old logo delete failed", e),
        );
      }

      const [result] = await pool.query(
        `UPDATE work_experience 
         SET position=?, company=?, employmentType=?, startedAt=?, endDate=?, currentlyWorking=?, description=?, technologies=?, companyLogo=?, updatedAt=NOW() 
         WHERE id=?`,
        [
          position,
          company,
          employmentType || "Full-time",
          startedAt,
          normalizedEndDate,
          isCurrentlyWorking,
          description,
          technologies || null,
          JSON.stringify(finalLogoOBJ.key ? finalLogoOBJ : null),
          expId,
        ],
      );

      if (result.affectedRows === 0) {
        if (newFileKey) await deleteFromLocal(newFileKey);
        return res
          .status(404)
          .json({ success: false, message: "Experience not found!" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Experience updated successfully!" });
    } else {
      // 3. INSERT Logic
      const [result] = await pool.query(
        `INSERT INTO work_experience 
         (position, company, employmentType, startedAt, endDate, currentlyWorking, description, technologies, companyLogo) 
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
          JSON.stringify(finalLogoOBJ.key ? finalLogoOBJ : null),
        ],
      );

      return res.status(201).json({
        success: true,
        message: "Experience added successfully!",
        expId: result.insertId,
      });
    }
  } catch (error) {
    console.error("❌ Experience Error:", error);
    if (newFileKey) await deleteFromLocal(newFileKey); // Rollback
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const deleteExp = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT companyLogo FROM work_experience WHERE id = ?",
      [id],
    );
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Experience not found!" });

    // 4. Delete Logo from Local Storage
    const logoData =
      typeof rows[0].companyLogo === "string"
        ? safeParse(rows[0].companyLogo)
        : rows[0].companyLogo;
    if (logoData?.key) {
      await deleteFromLocal(logoData.key).catch((e) =>
        console.error("File delete failed", e),
      );
    }

    await pool.query("DELETE FROM work_experience WHERE id = ?", [id]);
    return res
      .status(200)
      .json({ success: true, message: "Experience deleted successfully!" });
  } catch (error) {
    console.error("DELETE_EXP_ERROR:", error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

// Controller: Get all experiences
export const getExp = async (req, res) => {
  try {
    // 🧠 Fetch data from DB (ordered by most recent first)
    const [rows] = await pool.query(
      `
      SELECT * FROM work_experience ORDER BY startedAt DESC
      `,
    );

    // 🟢 Success Response
    return res.status(200).json({
      success: true,
      total: rows.length,
      experiences: rows,
    });
  } catch (error) {
    console.error("Error in getExp:", error);
    return res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Internal Server Error!",
    });
  }
};
