import { body, validationResult } from "express-validator";
import pool from "../db.config.js";
import { logActivity } from "../Utils/activityLogger.js";
import { safeParseJSON } from "../Utils/safeParseJSON.js";
import { parseBoolean } from "../Utils/SafeParser.js";
import {
  uploadFile,
  uploadMultipleFiles,
} from "../Utils/uploadToCloudinary.js";
import { cleanupCloudinaryFiles } from "../Utils/deleteFromCloudinary.js";

export const AddProjectValidation = [
  body("title").notEmpty().withMessage("Project title is required"),
  body("slug").notEmpty().withMessage("Slug is required"),
  body("shortDesc").notEmpty().withMessage("Short description is required"),

  body("repoLink")
    .optional()
    .isURL()
    .withMessage("Repository link must be a valid URL"),
  body("category").notEmpty().withMessage("Category is required"),
  body("visibility").notEmpty().withMessage("Visibility is required"),
];

export const UpdateProjectValidation = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("slug").optional().notEmpty().withMessage("Slug cannot be empty"),
  body("shortDesc")
    .optional()
    .notEmpty()
    .withMessage("Short description cannot be empty"),
  body("repoLink")
    .optional()
    .isURL()
    .withMessage("Repository link must be a valid URL"),
  body("category")
    .optional()
    .notEmpty()
    .withMessage("Category cannot be empty"),
  body("visibility")
    .optional()
    .notEmpty()
    .withMessage("Visibility cannot be empty"),
];

// Parse JSON safely
const parseJSON = (value, fallback = null) => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

// Extract Cloudinary public IDs
const getPublicIds = (assets) => {
  if (!assets) return [];

  const items = Array.isArray(assets) ? assets : [assets];

  return items
    .map((item) => item?.key)
    .filter((key) => typeof key === "string" && key.trim());
};

export const addOrUpdateProject = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const isUpdate = Boolean(req.params?.id);
  const projectId = req.params?.id;

  // Track newly uploaded files for rollback
  const uploadedKeys = [];

  let databaseCommitted = false;

  try {
    let {
      title,
      slug,
      shortDesc,
      content,
      repoLink,
      liveDemo,
      techStack,
      tag,
      metaKeywords,
      category,
      status,
      featured,
      visibility,
      estTime,
      seoTitle,
      metaDesc,
      canonicalUrl,
      isHeroImageRemoved,
      isOgImageRemoved,
      isGalleryRemoved,
    } = req.body;

    // Parse incoming JSON fields
    techStack = parseJSON(techStack, []);
    tag = parseJSON(tag, []);
    metaKeywords = parseJSON(metaKeywords, []);

    const removeHero = parseBoolean(isHeroImageRemoved);
    const removeOg = parseBoolean(isOgImageRemoved);
    const removeGallery = parseBoolean(isGalleryRemoved);

    // 1. Fetch existing project data during update
    let existingProject = null;

    if (isUpdate) {
      const [rows] = await pool.query(
        `SELECT id, heroImage, ogProjectImage, gallery
         FROM projects
         WHERE id = ?
         LIMIT 1`,
        [projectId],
      );

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: "Project not found!",
        });
      }

      existingProject = rows[0];
    }

    const oldHeroImage = parseJSON(existingProject?.heroImage, null);

    const oldOgImage = parseJSON(existingProject?.ogProjectImage, null);

    const oldGallery = parseJSON(existingProject?.gallery, []);

    // 2. Upload new hero and OG images
    const heroFile = req.files?.heroImage?.[0];
    const ogFile = req.files?.ogProjectImage?.[0];
    const galleryFiles = req.files?.gallery || [];

    const uploadTasks = await Promise.allSettled([
      heroFile ? uploadFile(heroFile, "projects/hero") : Promise.resolve(null),

      ogFile ? uploadFile(ogFile, "projects/og") : Promise.resolve(null),

      uploadMultipleFiles(galleryFiles, "projects/gallery"),
    ]);

    // Collect every successful upload immediately
    const [heroTask, ogTask, galleryTask] = uploadTasks;

    if (heroTask.status === "fulfilled" && heroTask.value) {
      uploadedKeys.push(heroTask.value.key);
    }

    if (ogTask.status === "fulfilled" && ogTask.value) {
      uploadedKeys.push(ogTask.value.key);
    }

    let galleryResults = [];

    if (galleryTask.status === "fulfilled") {
      galleryResults = galleryTask.value.successfulUploads || [];

      galleryResults.forEach((image) => {
        uploadedKeys.push(image.key);
      });
    }

    // Check for hero/OG upload errors
    const uploadErrors = uploadTasks
      .filter((task) => task.status === "rejected")
      .map((task) => task.reason);

    // Check for partial gallery upload errors
    if (galleryTask.status === "fulfilled") {
      uploadErrors.push(...(galleryTask.value.errors || []));
    }

    if (uploadErrors.length) {
      throw new Error(
        `One or more Cloudinary uploads failed: ${uploadErrors
          .map((error) => error?.message || String(error))
          .join(", ")}`,
      );
    }

    const heroResult = heroTask.value;
    const ogResult = ogTask.value;

    // 3. Prepare final images
    const heroImageFinal = heroResult
      ? heroResult
      : removeHero
        ? null
        : oldHeroImage;

    const ogImageFinal = ogResult ? ogResult : removeOg ? null : oldOgImage;

    // New gallery replaces old gallery
    // If no new files are uploaded, preserve old gallery unless removed
    let finalGallery = oldGallery;

    if (galleryResults.length > 0) {
      finalGallery = galleryResults;
    } else if (removeGallery) {
      finalGallery = [];
    }

    // 4. Prepare common database values
    const commonValues = [
      title,
      slug,
      shortDesc,
      content,
      repoLink || null,
      liveDemo || null,
      canonicalUrl || null,
      JSON.stringify(heroImageFinal),
      JSON.stringify(ogImageFinal),
      JSON.stringify(finalGallery),
      JSON.stringify(techStack),
      JSON.stringify(tag),
      JSON.stringify(metaKeywords),
      seoTitle || null,
      metaDesc || null,
      category,
      status,
      parseBoolean(featured),
      visibility,
      estTime || null,
    ];

    // 5. Insert or update project
    if (isUpdate) {
      await pool.query(
        `UPDATE projects SET
          title = ?,
          slug = ?,
          shortDesc = ?,
          content = ?,
          repoLink = ?,
          liveDemo = ?,
          canonicalUrl = ?,
          heroImage = ?,
          ogProjectImage = ?,
          gallery = ?,
          techStack = ?,
          tag = ?,
          metaKeywords = ?,
          seoTitle = ?,
          metaDesc = ?,
          category = ?,
          status = ?,
          featured = ?,
          visibility = ?,
          estTime = ?
        WHERE id = ?`,
        [...commonValues, projectId],
      );
    } else {
      await pool.query(
        `INSERT INTO projects (
          title,
          slug,
          shortDesc,
          content,
          repoLink,
          liveDemo,
          canonicalUrl,
          heroImage,
          ogProjectImage,
          gallery,
          techStack,
          tag,
          metaKeywords,
          seoTitle,
          metaDesc,
          category,
          status,
          featured,
          visibility,
          estTime
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        commonValues,
      );
    }

    // Database operation succeeded
    databaseCommitted = true;

    // 6. Delete old assets only after successful DB operation
    if (isUpdate) {
      const oldAssetsToDelete = [];

      // Old hero image
      if ((heroResult || removeHero) && oldHeroImage?.key) {
        oldAssetsToDelete.push(oldHeroImage.key);
      }

      // Old OG image
      if ((ogResult || removeOg) && oldOgImage?.key) {
        oldAssetsToDelete.push(oldOgImage.key);
      }

      // Old gallery
      if (galleryResults.length > 0 || removeGallery) {
        oldAssetsToDelete.push(...getPublicIds(oldGallery));
      }

      await cleanupCloudinaryFiles(
        oldAssetsToDelete,
        "Old project assets cleanup",
      );
    }

    return res.status(isUpdate ? 200 : 201).json({
      success: true,
      message: `Project ${isUpdate ? "updated" : "added"} successfully!`,
    });
  } catch (error) {
    console.error("❌ Project Controller Error:", error);

    // Rollback only newly uploaded files if DB operation failed
    if (!databaseCommitted && uploadedKeys.length > 0) {
      await cleanupCloudinaryFiles(uploadedKeys, "New uploads rollback");
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// --- DELETE PROJECT ---
export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Fetch project assets from database
    const [rows] = await pool.query(
      `SELECT heroImage, ogProjectImage, gallery
       FROM projects
       WHERE id = ?
       LIMIT 1`,
      [id],
    );

    const project = rows[0];

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found!",
      });
    }

    // 2. Parse JSON safely
    const parseJSON = (value, fallback = null) => {
      if (!value) return fallback;

      if (typeof value !== "string") {
        return value;
      }

      try {
        return JSON.parse(value);
      } catch (error) {
        console.error("JSON Parse Error:", error);
        return fallback;
      }
    };

    const heroImage = parseJSON(project.heroImage);
    const ogImage = parseJSON(project.ogProjectImage);
    const gallery = parseJSON(project.gallery, []);

    // 3. Collect all Cloudinary public IDs
    const filesToDelete = [
      heroImage?.key,
      ogImage?.key,
      ...(Array.isArray(gallery) ? gallery.map((image) => image?.key) : []),
    ].filter((key) => typeof key === "string" && key.trim());

    // Remove duplicate public IDs
    const uniquePublicIds = [...new Set(filesToDelete)];

    // 4. Delete project from database first
    await pool.query("DELETE FROM projects WHERE id = ?", [id]);

    // 5. Delete all associated Cloudinary assets
    let cloudinaryCleanup = {
      success: true,
      deletedCount: 0,
    };

    if (uniquePublicIds.length > 0) {
      const deleteResult = await deleteFromCloudinary(uniquePublicIds);

      if (deleteResult.success) {
        cloudinaryCleanup.deletedCount = uniquePublicIds.length;
      } else {
        cloudinaryCleanup.success = false;

        console.error("❌ Cloudinary Cleanup Failed:", deleteResult.error);
      }
    }

    // 6. Log activity separately
    try {
      await logActivity({
        type: "PROJECT_DELETE",
        title: "Project Deleted",
        description: `Project with ID ${id} was deleted.`,
        ip: req.ip,
        device: req.headers["user-agent"],
      });
    } catch (logError) {
      console.error("Activity Log Error:", logError.message);
    }

    // 7. Send response
    return res.status(200).json({
      success: true,
      message: cloudinaryCleanup.success
        ? "Project and all related images deleted successfully!"
        : "Project deleted, but some Cloudinary images could not be deleted.",
      cloudinary: {
        success: cloudinaryCleanup.success,
        totalFiles: uniquePublicIds.length,
        deletedCount: cloudinaryCleanup.deletedCount,
      },
    });
  } catch (error) {
    console.error("❌ Delete Project Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error deleting project!",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getProjects = async (req, res) => {
  try {
    const [projects] = await pool.query("SELECT * FROM projects");

    const formattedData = projects.map((item) => ({
      ...item,
      heroImage: safeParseJSON(item.heroImage),
      ogProjectImage: safeParseJSON(item.ogProjectImage),
      gallery: safeParseJSON(item.gallery, []),
      techStack: safeParseJSON(item.techStack, []),
      tag: safeParseJSON(item.tag, []),
      metaKeywords: safeParseJSON(item.metaKeywords, []),
    }));

    return res.status(200).json({
      success: true,
      successCode: "GET_PROJECTS",
      message: "Projects fetched successfully.",
      projects: formattedData,
    });
  } catch (error) {
    console.error("GET_PROJECTS_ERROR:", error);

    return res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Internal Server Error!",
    });
  }
};
