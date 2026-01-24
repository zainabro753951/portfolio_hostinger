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
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const uploadedKeys = []; // Rollback ke liye keys track karenge
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
    // Parsing logic remains same
    const parseIfString = (data) =>
      typeof data === "string" ? safeParse(data) : data;
    techStack = parseIfString(techStack);
    tag = parseIfString(tag);
    metaKeywords = parseIfString(metaKeywords);
    galleryOBJS = parseIfString(galleryOBJS) || [];
    heroImageOBJ = parseIfString(heroImageOBJ);
    ogProjectImageOBJ = parseIfString(ogProjectImageOBJ);

    // Image Uploads (Parallel ⚡)
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

    // Keys track karein rollback ke liye
    if (heroResult) uploadedKeys.push(heroResult.key);
    if (ogResult) uploadedKeys.push(ogResult.key);
    galleryResults.forEach((item) => uploadedKeys.push(item.key));

    // Construct final objects
    const heroImageFinal = {
      url:
        heroResult?.url ||
        (isHeroImageRemoved ? null : heroImageOBJ?.url) ||
        null,
      key:
        heroResult?.key ||
        (isHeroImageRemoved ? null : heroImageOBJ?.key) ||
        null,
    };
    const ogImageFinal = {
      url:
        ogResult?.url ||
        (isOgImageRemoved ? null : ogProjectImageOBJ?.url) ||
        null,
      key:
        ogResult?.key ||
        (isOgImageRemoved ? null : ogProjectImageOBJ?.key) ||
        null,
    };

    // Gallery Logic: Combine existing with new
    let finalGallery = galleryResults.length
      ? galleryResults.map((i) => ({ key: i.key, url: i.url }))
      : isGalleryRemoved
        ? []
        : galleryOBJS;

    if (isUpdate) {
      // 1. Cleanup Old Files from Local Storage
      if ((isHeroImageRemoved || heroResult) && heroImageOBJ?.key)
        await deleteFromLocal(heroImageOBJ.key);
      if ((isOgImageRemoved || ogResult) && ogProjectImageOBJ?.key)
        await deleteFromLocal(ogProjectImageOBJ.key);
      if (isGalleryRemoved && galleryOBJS?.length) {
        for (const img of galleryOBJS)
          if (img.key) await deleteFromLocal(img.key);
      }

      // 2. DB Update
      const query = `UPDATE projects SET title=?, slug=?, shortDesc=?, content=?, repoLink=?, liveDemo=?, canonicalUrl=?, heroImage=?, ogProjectImage=?, gallery=?, techStack=?, tag=?, metaKeywords=?, seoTitle=?, metaDesc=?, category=?, status=?, featured=?, visibility=?, estTime=? WHERE id=?`;

      const values = [
        title,
        slug,
        shortDesc,
        content,
        repoLink || null,
        liveDemo || null,
        canonicalUrl || null,
        JSON.stringify(heroImageFinal.key ? heroImageFinal : null),
        JSON.stringify(ogImageFinal.key ? ogImageFinal : null),
        JSON.stringify(finalGallery),
        JSON.stringify(techStack || []),
        JSON.stringify(tag || []),
        JSON.stringify(metaKeywords || []),
        seoTitle || null,
        metaDesc || null,
        category,
        status,
        featured === "true",
        visibility,
        estTime || null,
        projectId,
      ];

      await pool.query(query, values);
      await logActivity({
        type: "PROJECT_UPDATE",
        title: "Project Updated",
        description: `"${title}" updated.`,
        ip: req.ip,
        device: req.headers["user-agent"],
      });

      return res
        .status(200)
        .json({ success: true, message: "Project updated successfully!" });
    } else {
      // 3. DB Insert
      const query = `INSERT INTO projects (title, slug, shortDesc, content, repoLink, liveDemo, canonicalUrl, heroImage, ogProjectImage, gallery, techStack, tag, metaKeywords, seoTitle, metaDesc, category, status, featured, visibility, estTime) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

      const values = [
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
        JSON.stringify(techStack || []),
        JSON.stringify(tag || []),
        JSON.stringify(metaKeywords || []),
        seoTitle || null,
        metaDesc || null,
        category,
        status,
        featured === "true",
        visibility,
        estTime || null,
      ];

      await pool.query(query, values);
      return res
        .status(201)
        .json({ success: true, message: "Project added successfully!" });
    }
  } catch (error) {
    console.error("❌ Error:", error);
    // Rollback uploaded local files
    for (const key of uploadedKeys) {
      await deleteFromLocal(key).catch((e) =>
        console.error("Rollback failed:", e),
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
    const [rows] = await pool.query(
      "SELECT heroImage, ogProjectImage, gallery FROM projects WHERE id = ?",
      [id],
    );
    const project = rows[0];
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    // Delete local files
    const filesToDelete = [];
    if (project.heroImage?.key) filesToDelete.push(project.heroImage.key);
    if (project.ogProjectImage?.key)
      filesToDelete.push(project.ogProjectImage.key);
    if (project.gallery)
      project.gallery.forEach((img) => {
        if (img.key) filesToDelete.push(img.key);
      });

    await Promise.all(filesToDelete.map((key) => deleteFromLocal(key)));

    await pool.query("DELETE FROM projects WHERE id = ?", [id]);
    return res.status(200).json({ success: true, message: "Project deleted!" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error deleting project" });
  }
};

export const getProjects = async (req, res) => {
  try {
    const [projects] = await pool.query("SELECT * FROM projects");

    return res.status(200).json({
      success: true,
      successCode: "GET_PROJECTS",
      message: "Projects fetched successfully.",
      projects,
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
