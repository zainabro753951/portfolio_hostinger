import pool from "../db.config.js";
import { body, validationResult } from "express-validator";
import { deleteFromLocal, uploadToLocal } from "../Utils/uploadToLocal.js"; // Updated Helper
import { safeParse } from "../Utils/SafeParser.js";

export const AddEducationValidation = [
  body("institutionName")
    .notEmpty()
    .withMessage("Institution name is required!"),

  body("degree").notEmpty().withMessage("Degree is required!"),

  body("fieldStudy").notEmpty().withMessage("Field of study is required!"),

  body("grade").notEmpty().withMessage("Grade is required!"),

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
    certificateOBJ,
    isUpdate,
    educationId,
  } = req.body;

  isUpdate = isUpdate === "true" || isUpdate === true;
  certificateOBJ =
    typeof certificateOBJ === "string"
      ? safeParse(certificateOBJ)
      : certificateOBJ;

  let newFileKey = ""; // Rollback ke liye track karenge

  try {
    // 1. Upload new file if provided
    let uploadResult = null;
    if (req.file) {
      uploadResult = await uploadToLocal(req.file, "education/certificates");
      newFileKey = uploadResult?.key;
    }

    // 2. Build final certificate object
    const finalCertificate = {
      key: uploadResult?.key || certificateOBJ?.key || null,
      url: uploadResult?.url || certificateOBJ?.url || null,
    };

    if (isUpdate) {
      // Record check karein
      const [rows] = await pool.query(
        "SELECT certificate FROM education WHERE id = ?",
        [educationId],
      );
      if (rows.length === 0) {
        if (newFileKey) await deleteFromLocal(newFileKey);
        return res
          .status(404)
          .json({ success: false, message: "Record not found!" });
      }

      const existingCert =
        typeof rows[0].certificate === "string"
          ? safeParse(rows[0].certificate)
          : rows[0].certificate;

      // Agar naya file aaya hai to purana delete karein
      if (req.file && existingCert?.key) {
        await deleteFromLocal(existingCert.key).catch((e) =>
          console.error("Old file delete failed", e),
        );
      }

      await pool.query(
        `UPDATE education SET institutionName=?, degree=?, fieldStudy=?, grade=?, startYear=?, endYear=?, location=?, eduDesc=?, certificate=? WHERE id=?`,
        [
          institutionName,
          degree,
          fieldStudy,
          grade,
          startYear,
          endYear,
          location,
          eduDesc,
          JSON.stringify(finalCertificate.key ? finalCertificate : null),
          educationId,
        ],
      );

      return res
        .status(200)
        .json({ success: true, message: "Education updated successfully." });
    } else {
      // Insert Logic: Check duplication
      const [duplicate] = await pool.query(
        "SELECT id FROM education WHERE degree=? AND fieldStudy=? AND institutionName=?",
        [degree, fieldStudy, institutionName],
      );

      if (duplicate.length > 0) {
        if (newFileKey) await deleteFromLocal(newFileKey);
        return res.status(400).json({
          success: false,
          message: "This education entry already exists!",
        });
      }

      await pool.query(
        `INSERT INTO education (institutionName, degree, fieldStudy, grade, startYear, endYear, location, eduDesc, certificate) VALUES (?,?,?,?,?,?,?,?,?)`,
        [
          institutionName,
          degree,
          fieldStudy,
          grade,
          startYear,
          endYear,
          location,
          eduDesc,
          JSON.stringify(finalCertificate.key ? finalCertificate : null),
        ],
      );

      return res
        .status(201)
        .json({ success: true, message: "Education registered successfully." });
    }
  } catch (error) {
    console.error("Education Controller Error:", error);
    if (newFileKey) await deleteFromLocal(newFileKey); // Rollback
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const deleteEducation = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const [rows] = await pool.query(
      "SELECT certificate FROM education WHERE id = ?",
      [id],
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Not found!" });

    const cert =
      typeof rows[0].certificate === "string"
        ? safeParse(rows[0].certificate)
        : rows[0].certificate;

    // Delete file from local storage
    if (cert?.key) {
      await deleteFromLocal(cert.key).catch((e) =>
        console.error("File delete failed", e),
      );
    }

    await pool.query("DELETE FROM education WHERE id = ?", [id]);
    return res
      .status(200)
      .json({ success: true, message: "Education deleted successfully!" });
  } catch (error) {
    console.error("Delete Education Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
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
