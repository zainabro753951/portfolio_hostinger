const RESPONSIVE_WIDTHS = [320, 480, 640, 768, 1024];

export const RESPONSIVE_IMAGE_SIZES =
  "(max-width: 639px) 176px, " +
  "(max-width: 767px) 256px, " +
  "(max-width: 1023px) 320px, " +
  "(max-width: 1279px) 50vw, " +
  "600px";

/**
 * Generates responsive Cloudinary image URLs.
 * Supports Cloudinary URLs only.
 */
export const getResponsiveImageSrcSet = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") return undefined;

  try {
    const url = new URL(imageUrl);

    if (url.hostname !== "res.cloudinary.com") {
      return undefined;
    }

    if (url.protocol !== "https:") {
      return undefined;
    }

    const uploadMarker = "/upload/";
    const uploadIndex = url.pathname.indexOf(uploadMarker);

    if (uploadIndex === -1) return undefined;

    const uploadPrefix = url.pathname.slice(
      0,
      uploadIndex + uploadMarker.length,
    );

    const imagePath = url.pathname.slice(uploadIndex + uploadMarker.length);

    if (!imagePath) return undefined;

    return RESPONSIVE_WIDTHS.map((width) => {
      const transformedUrl = new URL(url.toString());

      transformedUrl.pathname = `${uploadPrefix}f_auto,q_auto,w_${width},c_limit/${imagePath}`;

      return `${transformedUrl.toString()} ${width}w`;
    }).join(", ");
  } catch {
    return undefined;
  }
};
