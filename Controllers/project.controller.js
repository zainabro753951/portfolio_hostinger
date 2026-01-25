import { body, validationResult } from "express-validator";
import pool from "../db.config.js";
import { uploadToLocal, deleteFromLocal } from "../Utils/uploadToLocal.js"; // Local Helper
import { safeParse } from "../Utils/SafeParser.js";
import { logActivity } from "../Utils/activityLogger.js";

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

export const addOrUpdateProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, errors: errors.array() });

  const uploadedKeys = [];
  const isUpdate = Boolean(req.params?.id);
  const projectId = req.params.id;

  let {
    title,
    slug,
    shortDesc,
    content,
    repoLink,
    liveDemo,
    heroImageOBJ,
    ogProjectImageOBJ,
    galleryOBJS,
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

  try {
    const parseIfString = (data) => {
      if (!data) return null;
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch {
          return data;
        }
      }
      return data;
    };

    const isTrue = (val) => val === "true" || val === true;

    // Parse incoming data
    techStack = parseIfString(techStack) || [];
    tag = parseIfString(tag) || [];
    metaKeywords = parseIfString(metaKeywords) || [];
    galleryOBJS = parseIfString(galleryOBJS) || [];
    heroImageOBJ = parseIfString(heroImageOBJ);
    ogProjectImageOBJ = parseIfString(ogProjectImageOBJ);

    // ✅ 1. Upload New Files
    const [heroResult, ogResult, galleryResults] = await Promise.all([
      req.files?.heroImage?.[0]
        ? uploadToLocal(req.files.heroImage[0], "projects/hero")
        : null,
      req.files?.ogProjectImage?.[0]
        ? uploadToLocal(req.files.ogProjectImage[0], "projects/og")
        : null,
      req.files?.gallery?.length
        ? Promise.all(
            req.files.gallery.map((img) =>
              uploadToLocal(img, "projects/gallery"),
            ),
          )
        : [],
    ]);

    // Track for rollback
    if (heroResult) uploadedKeys.push(heroResult.key);
    if (ogResult) uploadedKeys.push(ogResult.key);
    galleryResults.forEach((item) => uploadedKeys.push(item.key));

    // ✅ 2. Logic for Final Database State
    const heroImageFinal = heroResult
      ? { url: heroResult.url, key: heroResult.key }
      : isTrue(isHeroImageRemoved)
        ? null
        : heroImageOBJ;

    const ogImageFinal = ogResult
      ? { url: ogResult.url, key: ogResult.key }
      : isTrue(isOgImageRemoved)
        ? null
        : ogProjectImageOBJ;

    // Gallery Logic: Agar naya upload hai to naye images, warna purani gallery (ya empty)
    let finalGallery = galleryOBJS;
    if (galleryResults.length > 0) {
      finalGallery = galleryResults.map((i) => ({ key: i.key, url: i.url }));
    } else if (isTrue(isGalleryRemoved)) {
      finalGallery = [];
    }

    // ✅ 3. DB Operations
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
      isTrue(featured),
      visibility,
      estTime || null,
    ];

    if (isUpdate) {
      await pool.query(
        `UPDATE projects SET title=?, slug=?, shortDesc=?, content=?, repoLink=?, liveDemo=?, canonicalUrl=?, heroImage=?, ogProjectImage=?, gallery=?, techStack=?, tag=?, metaKeywords=?, seoTitle=?, metaDesc=?, category=?, status=?, featured=?, visibility=?, estTime=? WHERE id=?`,
        [...commonValues, projectId],
      );
    } else {
      await pool.query(
        `INSERT INTO projects (title, slug, shortDesc, content, repoLink, liveDemo, canonicalUrl, heroImage, ogProjectImage, gallery, techStack, tag, metaKeywords, seoTitle, metaDesc, category, status, featured, visibility, estTime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        commonValues,
      );
    }

    // ✅ 4. Cleanup Old Files (Sirf Update Case Mein)
    if (isUpdate) {
      // CLEANUP HERO: Agar naya upload hua YA user ne remove kiya
      if ((heroResult || isTrue(isHeroImageRemoved)) && heroImageOBJ?.key) {
        await deleteFromLocal(heroImageOBJ.key).catch((e) =>
          console.error("Cleanup Hero Fail:", e),
        );
      }

      // CLEANUP OG: Agar naya upload hua YA user ne remove kiya
      if ((ogResult || isTrue(isOgImageRemoved)) && ogProjectImageOBJ?.key) {
        await deleteFromLocal(ogProjectImageOBJ.key).catch((e) =>
          console.error("Cleanup OG Fail:", e),
        );
      }

      // CLEANUP GALLERY: Agar naye images aaye YA user ne पूरी gallery remove ki
      if (
        (galleryResults.length > 0 || isTrue(isGalleryRemoved)) &&
        Array.isArray(galleryOBJS)
      ) {
        for (const img of galleryOBJS) {
          if (img?.key)
            await deleteFromLocal(img.key).catch((e) =>
              console.error("Cleanup Gallery Fail:", e),
            );
        }
      }
    }

    return res.status(isUpdate ? 200 : 201).json({
      success: true,
      message: `Project ${isUpdate ? "updated" : "added"} successfully!`,
    });
  } catch (error) {
    console.error("❌ Controller Error:", error);
    for (const key of uploadedKeys) {
      await deleteFromLocal(key).catch((e) =>
        console.error("Rollback Error:", e),
      );
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
};

// --- DELETE PROJECT ---
export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    // 1️⃣ Get project images from DB
    const [rows] = await pool.query(
      "SELECT heroImage, ogProjectImage, gallery FROM projects WHERE id = ?",
      [id],
    );

    const project = rows[0];
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    // 2️⃣ Parse JSON fields (if stored as string)
    const parseJSON = (str) => {
      if (!str) return null;
      try {
        return JSON.parse(str);
      } catch (e) {
        console.error("JSON parse error:", e);
        return null;
      }
    };

    const heroImage = parseJSON(project.heroImage);
    const ogImage = parseJSON(project.ogProjectImage);
    const gallery = Array.isArray(project.gallery)
      ? project.gallery
      : parseJSON(project.gallery) || [];

    // 3️⃣ Collect all keys for deletion
    const filesToDelete = [];

    if (heroImage?.key) filesToDelete.push(heroImage.key);
    if (ogImage?.key) filesToDelete.push(ogImage.key);
    if (gallery?.length) {
      gallery.forEach((img) => {
        if (img?.key) filesToDelete.push(img.key);
      });
    }

    // 4️⃣ Delete all files in parallel (safe)
    await Promise.all(filesToDelete.map((key) => deleteFromLocal(key)));

    // 5️⃣ Delete project from DB
    await pool.query("DELETE FROM projects WHERE id = ?", [id]);

    // 6️⃣ Optional: log activity
    await logActivity({
      type: "PROJECT_DELETE",
      title: "Project Deleted",
      description: `Project with ID ${id} was deleted.`,
      ip: req.ip,
      device: req.headers["user-agent"],
    });

    return res.status(200).json({
      success: true,
      message: "Project and all related images deleted!",
    });
  } catch (error) {
    console.error("❌ Delete project error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error deleting project" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const [projects] = await pool.query("SELECT * FROM projects");

    console.log(projects);
    const formattedData = projects.map((item) => ({
      ...item,
      heroImage: JSON.parse(item?.heroImage),
      ogProjectImage: JSON.parse(item?.ogProjectImage),
      gallery: JSON.parse(item.gallery),
      techStack: JSON.parse(item.techStack),
      tag: JSON.parse(item.tag),
      metaKeywords: JSON.parse(item.metaKeywords),
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
