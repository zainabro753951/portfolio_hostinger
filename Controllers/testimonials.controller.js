import pool from "../db.config.js";
import { body, validationResult } from "express-validator";
import { deleteFromLocal, uploadToLocal } from "../Utils/uploadToLocal.js"; // Local Helpers
import { safeParse } from "../Utils/SafeParser.js";

export const AddTestimonialValidation = [
  body("clientName").notEmpty().withMessage("Client name is required!"),

  body("designationRole")
    .notEmpty()
    .withMessage("Designation/Role is required!"),

  body("company").notEmpty().withMessage("Company name is required!"),

  body("ratting").notEmpty().withMessage("Ratting is required!"),

  body("projectId").notEmpty().withMessage("Project title is required!"),

  body("testimonialDate")
    .notEmpty()
    .withMessage("Testimonial date is required!"),

  body("message").notEmpty().withMessage("Client message is required!"),
];

export const addTestimonial = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  let {
    clientName,
    designationRole,
    company,
    ratting,
    projectId,
    testimonialDate,
    message,
    clientImageOBJ,
    isUpdate,
    testimonialID,
  } = req.body;

  // Type conversion
  isUpdate = isUpdate === "true" || isUpdate === true;
  clientImageOBJ =
    typeof clientImageOBJ === "string"
      ? safeParse(clientImageOBJ)
      : clientImageOBJ;

  let newFileKey = ""; // Tracking for rollback

  try {
    // 1. Upload new image if provided (Local Storage)
    let uploadResult = null;
    if (req.file) {
      uploadResult = await uploadToLocal(req.file, "testimonials");
      newFileKey = uploadResult?.key;
    }

    const finalClientImage = {
      url: uploadResult?.url || clientImageOBJ?.url || null,
      key: uploadResult?.key || clientImageOBJ?.key || null,
    };

    if (isUpdate) {
      // Check existing record
      const [rows] = await pool.query(
        "SELECT clientImage FROM testimonials WHERE id = ?",
        [testimonialID],
      );

      if (rows.length === 0) {
        if (newFileKey) await deleteFromLocal(newFileKey);
        return res
          .status(404)
          .json({ success: false, message: "Testimonial not found!" });
      }

      // Safe parse existing image
      const existingImg =
        typeof rows[0].clientImage === "string"
          ? safeParse(rows[0].clientImage)
          : rows[0].clientImage;

      // 2. Delete old image if a new one is uploaded
      if (req.file && existingImg?.key) {
        await deleteFromLocal(existingImg.key).catch((e) =>
          console.error("Old file delete failed", e),
        );
      }

      // 3. Perform update
      const [updateResult] = await pool.query(
        `UPDATE testimonials 
         SET clientName=?, designationRole=?, company=?, clientImage=?, ratting=?, projectId=?, testimonialDate=?, message=? 
         WHERE id=?`,
        [
          clientName,
          designationRole,
          company,
          JSON.stringify(finalClientImage.key ? finalClientImage : null),
          ratting,
          projectId,
          testimonialDate,
          message,
          testimonialID,
        ],
      );

      if (!updateResult.affectedRows) {
        if (newFileKey) await deleteFromLocal(newFileKey);
        return res
          .status(500)
          .json({ success: false, message: "Update failed!" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Testimonial updated successfully." });
    } else {
      // 4. INSERT LOGIC
      const [insertResult] = await pool.query(
        `INSERT INTO testimonials 
         (clientName, designationRole, company, clientImage, ratting, projectId, testimonialDate, message) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          clientName,
          designationRole,
          company,
          JSON.stringify(finalClientImage.key ? finalClientImage : null),
          ratting,
          projectId,
          testimonialDate,
          message,
        ],
      );

      if (!insertResult.affectedRows) {
        if (newFileKey) await deleteFromLocal(newFileKey);
        return res
          .status(500)
          .json({ success: false, message: "Failed to add testimonial!" });
      }

      return res
        .status(201)
        .json({ success: true, message: "Testimonial added successfully." });
    }
  } catch (error) {
    console.error("Testimonial Error:", error);
    if (newFileKey)
      await deleteFromLocal(newFileKey).catch((e) =>
        console.error("Rollback failed", e),
      );
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
};

export const deleteTestimonial = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT clientImage FROM testimonials WHERE id = ?",
      [id],
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: "Not found!" });

    const imgData =
      typeof rows[0].clientImage === "string"
        ? safeParse(rows[0].clientImage)
        : rows[0].clientImage;

    // 5. Delete file from local storage
    if (imgData?.key) {
      await deleteFromLocal(imgData.key).catch((e) =>
        console.error("File delete failed", e),
      );
    }

    await pool.query("DELETE FROM testimonials WHERE id = ?", [id]);
    return res
      .status(200)
      .json({ success: true, message: "Deleted successfully!" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getTestimonial = async (req, res) => {
  try {
    const [testimonials] = await pool.query("SELECT * FROM testimonials");

    return res.status(200).json({
      success: true,
      successCode: "GET_TESTIMONIAL",
      message: "Testimonial fetched successfully.",
      testimonials,
    });
  } catch (error) {
    console.error("GET_TESTIMONIAL_ERROR:", error);

    return res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Internal Server Error!",
    });
  }
};
