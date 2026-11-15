import { cloudinary } from "./cloudinary.config.js";

export const deleteFromCloudinary = async (files) => {
  try {
    if (!files || (Array.isArray(files) && !files.length)) {
      throw new Error("public_id required hai");
    }

    const fileList = Array.isArray(files) ? files : [files];

    const results = await Promise.all(
      fileList.map(async (file) => {
        const publicId = typeof file === "string" ? file : file?.key;

        const resourceType =
          typeof file === "string" ? "image" : file?.resource_type || "image";

        if (!publicId) {
          throw new Error("Cloudinary public_id missing hai");
        }

        const result = await cloudinary.uploader.destroy(publicId, {
          resource_type: resourceType,
          type: "upload",
          invalidate: true,
        });

        console.log("Cloudinary deletion:", {
          publicId,
          resourceType,
          result: result.result,
        });

        if (result.result !== "ok" && result.result !== "not found") {
          throw new Error(`Deletion failed: ${publicId} - ${result.result}`);
        }

        return {
          publicId,
          resourceType,
          result: result.result,
          success: result.result === "ok",
        };
      }),
    );

    return {
      success: results.every((item) => item.success),
      results,
    };
  } catch (error) {
    console.error("CLOUDINARY_DELETE_ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete multiple newly uploaded files during rollback
export const rollbackUploads = async (publicIds) => {
  const ids = [...new Set(publicIds.filter(Boolean))];

  if (!ids.length) return;

  try {
    const result = await deleteFromCloudinary(ids);

    if (!result.success) {
      console.error("Cloudinary rollback failed:", result.error);
    }
  } catch (error) {
    console.error("Cloudinary rollback error:", error);
  }
};

// Delete Cloudinary files safely
export const cleanupCloudinaryFiles = async (publicIds, label = "Cleanup") => {
  const uniqueIds = [...new Set(publicIds.filter(Boolean))];

  if (!uniqueIds.length) return;

  try {
    const result = await deleteFromCloudinary(uniqueIds);

    if (!result.success) {
      console.error(`❌ ${label} failed:`, result.error);
      return;
    }

    console.log(`✅ ${label} completed:`, uniqueIds.length);
  } catch (error) {
    console.error(`❌ ${label} error:`, error.message);
  }
};
