import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import fsSync from "fs";

export const uploadToLocal = async (file, folder = "others") => {
  try {
    if (!file) throw new Error("No file provided");

    // 1. Path setup
    const uploadsBase = path.join(process.cwd(), "uploads");
    const targetDir = path.join(uploadsBase, folder);

    // 2. Folder create karein agar nahi hai
    if (!fsSync.existsSync(targetDir)) {
      fsSync.mkdirSync(targetDir, { recursive: true });
    }

    // 3. File name setup
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    const filePath = path.join(targetDir, fileName);

    // 4. SHARP INPUT CHECK (Yahan ghalti ho rahi thi)
    // Agar Multer memoryStorage use kar raha hai to file.buffer hoga
    // Agar diskStorage use kar raha hai to file.path hoga
    const inputData = file.buffer || file.path;

    if (!inputData) {
      throw new Error(
        "Invalid file input: Buffer or Path not found. Check your Multer config.",
      );
    }

    // 5. Image processing
    await sharp(inputData)
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
      .toFormat("webp")
      .webp({ quality: 80 })
      .toFile(filePath);

    // 6. Return values (Database ke liye)
    return {
      key: `${folder}/${fileName}`,
      url: `/uploads/${folder}/${fileName}`,
    };
  } catch (error) {
    console.error("Local Upload Error Details:", error);
    throw new Error("Failed to upload file to server");
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
