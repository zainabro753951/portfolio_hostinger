export const safeParseJSON = (value, fallback = null) => {
  if (value === null || value === undefined) {
    return fallback;
  }

  // Already parsed JSON (Object or Array)
  if (typeof value === "object") {
    return value;
  }

  // Only parse strings
  if (typeof value !== "string") {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("JSON Parse Error:", error.message);
    return fallback;
  }
};

// export const getProjects = async (req, res) => {
//   try {
//     const [projects] = await pool.query("SELECT * FROM projects");

//     const formattedData = projects.map((item) => ({
//       ...item,
//       heroImage: safeParseJSON(item.heroImage),
//       ogProjectImage: safeParseJSON(item.ogProjectImage),
//       gallery: safeParseJSON(item.gallery, []),
//       techStack: safeParseJSON(item.techStack, []),
//       tag: safeParseJSON(item.tag, []),
//       metaKeywords: safeParseJSON(item.metaKeywords, []),
//     }));

//     return res.status(200).json({
//       success: true,
//       successCode: "GET_PROJECTS",
//       message: "Projects fetched successfully.",
//       projects: formattedData,
//     });
//   } catch (error) {
//     console.error("GET_PROJECTS_ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       errorCode: "SERVER_ERROR",
//       message: "Internal Server Error!",
//     });
//   }
// };
