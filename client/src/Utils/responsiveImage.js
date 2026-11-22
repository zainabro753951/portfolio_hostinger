
const RESPONSIVE_WIDTHS = [480, 768, 1024, 1440];

export const RESPONSIVE_IMAGE_SIZES =
  "(max-width: 480px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 50vw, 600px";

/**
 * Generates responsive Cloudinary image URLs.
 * Supports Cloudinary URLs only.
 */
export const getResponsiveImageSrcSet = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") return undefined;

  try {
    const url = new URL(imageUrl);

    if (!url.hostname.includes("res.cloudinary.com")) {
      return undefined;
    }

    const uploadIndex = url.pathname.indexOf("/upload/");

    if (uploadIndex === -1) return undefined;

    return RESPONSIVE_WIDTHS.map((width) => {
      const transformedUrl = new URL(url.toString());

      const uploadPath = transformedUrl.pathname;
      const beforeUpload = uploadPath.slice(0, uploadIndex + 8);
      const afterUpload = uploadPath.slice(uploadIndex + 8);

      transformedUrl.pathname =
        `${beforeUpload}f_auto,q_auto,w_${width},c_limit/${afterUpload}`;

      return `${transformedUrl.toString()} ${width}w`;
    }).join(", ");
  } catch {
    return undefined;
  }
};
