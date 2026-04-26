// ✅ Utils/uploadToLocal.js - Sharp + Non-Image Support (FIXED)
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import fsSync from "fs";

const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/avif",
  "image/bmp",
  "image/tiff",
];

const isImage = (mimetype) =>
  IMAGE_MIME_TYPES.includes(mimetype?.toLowerCase());

export const uploadToLocal = async (file, folder = "others") => {
  try {
    if (!file) throw new Error("No file provided");

    // 1. Path setup
    const uploadsBase = path.join(process.cwd(), "uploads");
    const targetDir = path.join(uploadsBase, folder);

    // 2. Create folder if not exists
    if (!fsSync.existsSync(targetDir)) {
      fsSync.mkdirSync(targetDir, { recursive: true });
    }

    // 3. Sanitize filename
    const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const ext = path.extname(safeOriginalName).toLowerCase();
    const fileName = `${Date.now()}-${safeOriginalName}`;

    // 4. Input validation
    const inputData = file.buffer || file.path;
    if (!inputData)
      throw new Error("Invalid file input: Buffer or Path not found.");

    // 5. ✅ CONDITIONAL PROCESSING
    let finalFileName = fileName;
    let finalMimetype = file.mimetype;
    let finalSize = file.size;

    if (isImage(file.mimetype)) {
      // 🖼️ IMAGE: Sharp se optimize karo - SINGLE PASS
      const outputFileName = fileName.replace(ext, ".webp");
      const filePath = path.join(targetDir, outputFileName);

      // ✅ Single Sharp chain with toFile() - terminal method
      await sharp(inputData)
        .rotate() // Auto-rotate based on EXIF
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(filePath); // ✅ Terminal method - execution yahan hota hai

      // ✅ File size nikalne ke liye fs.stat use karein
      const stats = await fs.stat(filePath);

      finalFileName = outputFileName;
      finalMimetype = "image/webp";
      finalSize = stats.size; // ✅ Correct way to get size
    } else {
      // 📄 NON-IMAGE: Direct save
      const filePath = path.join(targetDir, fileName);
      await fs.writeFile(filePath, inputData);
      // fileName, mimetype, size unchanged
    }

    // 6. ✅ Return consistent structure
    return {
      key: `${folder}/${finalFileName}`,
      url: `/uploads/${folder}/${finalFileName}`,
      filename: finalFileName,
      size: finalSize,
      mimetype: finalMimetype,
      originalName: file.originalname,
    };
  } catch (error) {
    console.error("Local Upload Error Details:", error);
    throw new Error(`Failed to upload file to server: ${error.message}`);
  }
};

export const deleteFromLocal = async (key) => {
  if (!key) return;
  try {
    const filePath = path.join(process.cwd(), "uploads", key);
    if (fsSync.existsSync(filePath)) {
      await fs.unlink(filePath);
    }
  } catch (error) {
    console.error("Local Delete Error:", error);
  }
};
