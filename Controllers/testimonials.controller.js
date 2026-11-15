import { body, validationResult } from "express-validator";
import pool from "../db.config.js";
import { parseBoolean, safeParse } from "../Utils/SafeParser.js";
import { deleteFromLocal, uploadToLocal } from "../Utils/uploadToLocal.js"; // Local Helpers
import { uploadFile } from "../Utils/uploadToCloudinary.js";
import { deleteFromCloudinary } from "../Utils/deleteFromCloudinary.js";

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

  const {
    clientName,
    designationRole,
    company,
    ratting,
    projectId,
    testimonialDate,
    message,
  } = req.body;

  const isUpdate = parseBoolean(req.body.isUpdate);

  const testimonialID = isUpdate ? Number(req.body.testimonialID) : null;

  let uploadedImage = null;

  // Safely parse image data from database
  const parseClientImage = (value) => {
    try {
      const parsed = typeof value === "string" ? JSON.parse(value) : value;

      if (!parsed || typeof parsed !== "object" || !parsed.key) {
        return null;
      }

      return {
        key: parsed.key,
        url: parsed.url || null,
        resource_type: parsed.resource_type || "image",
      };
    } catch (error) {
      console.error("INVALID_TESTIMONIAL_IMAGE_DATA:", error);
      return null;
    }
  };

  // Delete newly uploaded image if database operation fails
  const rollbackUpload = async () => {
    if (!uploadedImage?.key) return;

    try {
      const result = await deleteFromCloudinary({
        key: uploadedImage.key,
        resource_type: uploadedImage.resource_type || "image",
      });

      if (!result?.success) {
        console.error(
          "TESTIMONIAL_IMAGE_ROLLBACK_FAILED:",
          result?.error || result,
        );
      }
    } catch (error) {
      console.error("TESTIMONIAL_IMAGE_ROLLBACK_ERROR:", error);
    }
  };

  try {
    let existingImage = null;

    // 1. Validate update ID and fetch existing record
    if (isUpdate) {
      if (!Number.isSafeInteger(testimonialID) || testimonialID <= 0) {
        return res.status(400).json({
          success: false,
          message: "Valid Testimonial ID is required for update!",
        });
      }

      const [rows] = await pool.query(
        "SELECT id, clientImage FROM testimonials WHERE id = ?",
        [testimonialID],
      );

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: "Testimonial not found!",
        });
      }

      // Database is the source of truth for existing image
      existingImage = parseClientImage(rows[0].clientImage);
    }

    // 2. Upload new image to Cloudinary
    if (req.file) {
      uploadedImage = await uploadFile(req.file, "testimonials");

      if (!uploadedImage?.key || !uploadedImage?.url) {
        throw new Error("Cloudinary image upload failed!");
      }

      uploadedImage = {
        key: uploadedImage.key,
        url: uploadedImage.url,
        resource_type: uploadedImage.resource_type || "image",
      };
    }

    // 3. Decide which image should be stored
    // New upload > Existing image > null
    const finalClientImage = uploadedImage || existingImage;

    const imageJSON = finalClientImage
      ? JSON.stringify(finalClientImage)
      : null;

    // 4. UPDATE testimonial
    if (isUpdate) {
      await pool.query(
        `UPDATE testimonials
         SET
           clientName = ?,
           designationRole = ?,
           company = ?,
           clientImage = ?,
           ratting = ?,
           projectId = ?,
           testimonialDate = ?,
           message = ?
         WHERE id = ?`,
        [
          clientName,
          designationRole,
          company,
          imageJSON,
          ratting,
          projectId || null,
          testimonialDate,
          message,
          testimonialID,
        ],
      );

      // 5. Delete old Cloudinary image only after DB update succeeds
      if (uploadedImage && existingImage?.key) {
        try {
          const deleteResult = await deleteFromCloudinary({
            key: existingImage.key,
            resource_type: existingImage.resource_type || "image",
          });

          if (!deleteResult?.success) {
            console.error(
              "OLD_TESTIMONIAL_IMAGE_DELETE_FAILED:",
              deleteResult?.error || deleteResult,
            );
          }
        } catch (error) {
          console.error("OLD_TESTIMONIAL_IMAGE_DELETE_ERROR:", error);
        }
      }

      return res.status(200).json({
        success: true,
        message: "Testimonial updated successfully.",
        data: {
          id: testimonialID,
          image: finalClientImage,
        },
      });
    }

    // 6. INSERT new testimonial
    const [insertResult] = await pool.query(
      `INSERT INTO testimonials
       (
         clientName,
         designationRole,
         company,
         clientImage,
         ratting,
         projectId,
         testimonialDate,
         message
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        clientName,
        designationRole,
        company,
        imageJSON,
        ratting,
        projectId || null,
        testimonialDate,
        message,
      ],
    );

    if (!insertResult.insertId) {
      throw new Error("Failed to insert testimonial!");
    }

    return res.status(201).json({
      success: true,
      message: "Testimonial added successfully.",
      data: {
        id: insertResult.insertId,
        image: finalClientImage,
      },
    });
  } catch (error) {
    console.error("TESTIMONIAL_ERROR:", error);

    // 7. Rollback newly uploaded image if DB operation fails
    await rollbackUpload();

    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

export const deleteTestimonial = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Validate testimonial ID
    const testimonialID = Number(id);

    if (!Number.isSafeInteger(testimonialID) || testimonialID <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID!",
      });
    }

    // 2. Fetch testimonial image from database
    const [rows] = await pool.query(
      "SELECT clientImage FROM testimonials WHERE id = ?",
      [testimonialID],
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found!",
      });
    }

    // 3. Safely parse Cloudinary image data
    let imgData = null;

    try {
      imgData =
        typeof rows[0].clientImage === "string"
          ? JSON.parse(rows[0].clientImage)
          : rows[0].clientImage;
    } catch (error) {
      console.error("INVALID_TESTIMONIAL_IMAGE_DATA:", error);
    }

    // 4. Delete image from Cloudinary
    if (imgData?.key) {
      const deleteResult = await deleteFromCloudinary({
        key: imgData.key,
        resource_type: imgData.resource_type || "image",
      });

      if (!deleteResult?.success) {
        console.error(
          "TESTIMONIAL_CLOUDINARY_DELETE_FAILED:",
          deleteResult?.error,
        );

        return res.status(500).json({
          success: false,
          message:
            "Unable to delete testimonial image. Testimonial was not deleted!",
        });
      }
    }

    // 5. Delete testimonial from database
    await pool.query("DELETE FROM testimonials WHERE id = ?", [testimonialID]);

    return res.status(200).json({
      success: true,
      message: "Testimonial and its image deleted successfully!",
    });
  } catch (error) {
    console.error("DELETE_TESTIMONIAL_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
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
