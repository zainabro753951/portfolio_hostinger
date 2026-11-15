import { cloudinary } from "./cloudinary.config.js";

export const uploadToCloudinary = async (file, options = {}) => {
  try {
    if (!file) throw new Error("File object required hai");

    const baseFolder =
      process.env.CLOUDINARY_BASE_FOLDER || "hostingerPortfolio";

    const fileStr = file.buffer
      ? `data:${file.mimetype};base64,${file.buffer.toString("base64")}`
      : file.path;

    const subFolder = options.folder || "";
    const folder = [baseFolder, subFolder].filter(Boolean).join("/");

    const result = await cloudinary.uploader.upload(fileStr, {
      resource_type: options.resource_type || "auto",
      transformation: options.transformation || [],
      public_id:
        options.public_id ||
        `${Date.now()}-${file.originalname?.split(".")[0] || "file"}`,
      ...options,
      folder, // Always use the main folder + subfolder
    });

    console.log("✅ File uploaded successfully");
    console.log("📁 Folder:", folder);
    console.log("🔗 Public ID:", result.public_id);
    console.log("🌐 Secure URL:", result.secure_url);

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

// Upload wrapper: failed Cloudinary uploads become errors
export const uploadFile = async (file, folder = "about") => {
  const result = await uploadToCloudinary(file, {
    folder,
    resource_type: "auto",
  });

  if (!result.success) {
    throw new Error(result.error || "Cloudinary upload failed");
  }

  return {
    key: result.public_id,
    url: result.url,
    resource_type: result.resource_type,
  };
};

// Upload multiple files safely
export const uploadMultipleFiles = async (files, folder) => {
  if (!files?.length) return [];

  const results = await Promise.allSettled(
    files.map((file) => uploadFile(file, folder)),
  );

  const successfulUploads = results
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  // Track successful uploads even if another upload failed
  return {
    successfulUploads,
    errors: results
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason),
  };
};
