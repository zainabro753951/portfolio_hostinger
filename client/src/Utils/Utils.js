import { toast } from "react-toastify";
import { useAddVisitors } from "../Queries/AddVisitors";
import {
  File,
  FileText,
  FileImage,
  FileCode,
  FileJson,
  FileArchive,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  FileBadge,
  FileType2,
  Terminal,
  Palette,
  Database,
  Settings,
  Package,
  Cloud,
  Lock,
  Key,
  GitBranch,
} from "lucide-react";

// utils/timeUtils.js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// ✅ User ka timezone detect karo (browser se)
export const getUserTimezone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

// ✅ Relative time with timezone fix
export const formatTimeAgo = (date, fallback = "Unknown") => {
  if (!date) return fallback;

  // UTC se user ke local timezone mein convert karo
  const userTz = getUserTimezone();
  const parsed = dayjs.utc(date).tz(userTz);

  if (!parsed.isValid()) return fallback;
  return parsed.fromNow();
};

// ✅ Exact date format bhi timezone ke saath
export const formatDateTime = (date, format = "DD MMM YYYY, hh:mm A") => {
  if (!date) return "—";
  const userTz = getUserTimezone();
  return dayjs.utc(date).tz(userTz).format(format);
};

export function colorGuess(lang) {
  const lower = lang?.toLowerCase();

  if (lower.includes("javascript") || lower.includes("js")) return "#F7DF1E"; // JS
  if (lower.includes("python") || lower.includes("py")) return "#3776AB"; // Python
  if (lower.includes("react")) return "#61DAFB"; // JSX
  if (
    lower.includes("typescript") ||
    lower.includes("ts") ||
    lower.includes("typescript")
  )
    return "#3178C6"; // TS

  return "#000000"; // default
}

// ============================================
// SAFE appendFormData — Handles all data types
// ============================================

const isFile = (value) => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.name === "string" &&
    typeof value.size === "number" &&
    typeof value.type === "string"
  );
};

/**
 * Safely checks if value is a Blob
 */
const isBlob = (value) => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.size === "number" &&
    typeof value.type === "string"
  );
};

export const appendFormData = (formData, data, parentKey = "") => {
  if (data === null || data === undefined) {
    formData.append(parentKey, "");
    return;
  }

  // Handle File objects
  if (isFile(data) || isBlob(data)) {
    formData.append(parentKey, data);
    return;
  }

  // Handle Date
  if (data instanceof Date) {
    formData.append(parentKey, data.toISOString());
    return;
  }

  // Handle Array
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const arrayKey = parentKey ? `${parentKey}[${index}]` : `[${index}]`;
      appendFormData(formData, item, arrayKey);
    });
    return;
  }

  // Handle Object
  if (typeof data === "object") {
    Object.keys(data).forEach((key) => {
      const nestedKey = parentKey ? `${parentKey}[${key}]` : key;
      appendFormData(formData, data[key], nestedKey);
    });
    return;
  }

  // Handle primitives (string, number, boolean)
  formData.append(parentKey, String(data));
};

/**
 * Alternative: Flat append (simpler, no nested brackets)
 * Use this if your backend expects flat keys like "seoPages[0].pageSlug"
 */
export const appendFormDataFlat = (formData, data, parentKey = "") => {
  if (data === null || data === undefined) {
    formData.append(parentKey, "");
    return;
  }

  if (isFile(data) || isBlob(data)) {
    formData.append(parentKey, data);
    return;
  }

  if (data instanceof Date) {
    formData.append(parentKey, data.toISOString());
    return;
  }

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const arrayKey = parentKey ? `${parentKey}.${index}` : `${index}`;
      appendFormDataFlat(formData, item, arrayKey);
    });
    return;
  }

  if (typeof data === "object") {
    Object.keys(data).forEach((key) => {
      const nestedKey = parentKey ? `${parentKey}.${key}` : key;
      appendFormDataFlat(formData, data[key], nestedKey);
    });
    return;
  }

  formData.append(parentKey, String(data));
};

/**
 * Create FormData from object in one call
 */
export const createFormData = (data) => {
  const formData = new FormData();
  appendFormData(formData, data);
  return formData;
};

// Frontend Skills Filter
export function frontendSkillFilter(skills) {
  const frontendSkillNames = [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Redux",
    "Tailwind CSS",
    "Bootstrap",
    "SASS/SCSS",
    "Material UI",
    "Framer Motion",
    "GSAP",
    "Locomotive Scroll",
    "Lenis Scroll",
    "Three.js",
    "Vite",
    "Webpack",
    "Parcel",
    "Git",
    "GitHub",
    "Responsive Design",
    "UI/UX Principles",
    "Figma",
    "Photoshop",
    "Performance Optimization",
    "Cross-Browser Compatibility",
    "RESTful APIs",
    "JSON",
    "AJAX",
    "npm / yarn",
    "ES6+",
    "DOM Manipulation",
    "Accessibility (a11y)",
    "Testing (Jest, React Testing Library)",
    "Firebase Hosting",
    "Netlify",
    "Vercel",
    "Code Optimization",
    "Modern UI Design",
  ];

  // ✅ Return only those skills that match any frontend skill
  return skills?.filter((userSkill) =>
    frontendSkillNames.some(
      (skill) => skill.toLowerCase() === userSkill.toLowerCase(),
    ),
  );
}

export function backendSkillFilter(skills) {
  const backendSkillNames = [
    "Node.js",
    "Express.js",
    "MongoDB",
    "Mongoose",
    "MySQL",
    "PostgreSQL",
    "SQLite",
    "Prisma",
    "Sequelize",
    "RESTful APIs",
    "GraphQL",
    "Apollo Server",
    "Next.js API Routes",
    "Authentication (JWT, OAuth, Passport.js)",
    "Bcrypt",
    "Session Management",
    "Cookies Handling",
    "Error Handling & Logging",
    "File Upload (Multer, Cloudinary)",
    "Socket.io (Real-time Communication)",
    "WebSockets",
    "Redis",
    "Caching",
    "Rate Limiting",
    "API Security (Helmet, CORS, CSRF)",
    "Validation (Joi, Express Validator, Zod)",
    "Environment Variables (.env)",
    "MVC Architecture",
    "Microservices",
    "Serverless Functions",
    "Firebase Admin SDK",
    "Cloud Functions",
    "AWS",
    "Google Cloud",
    "Docker",
    "EC2",
    "S3",
    "Lambda",
    "CI/CD Pipelines (GitHub Actions, Jenkins)",
    "Testing (Mocha, Chai, Jest, Supertest)",
    "Performance Optimization",
    "Database Design",
    "Data Modeling",
    "Error Tracking (Sentry)",
    "Version Control (Git)",
    "CLI Tools (Nodemon, PM2)",
    "Web Security Best Practices",
  ];

  return skills?.filter((userSkill) =>
    backendSkillNames?.some(
      (skill) => skill?.toLowerCase() === userSkill?.toLowerCase(),
    ),
  );
}

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

// Utils.js

export const getFileIcon = (fileName) => {
  if (!fileName) return { Icon: File, color: "#94a3b8", label: "File" };

  const ext = fileName.split(".").pop()?.toLowerCase();
  const name = fileName.split("/").pop()?.split("\\").pop() || fileName;

  // 🎨 Extension → Icon + Color + Label mapping
  const iconMap = {
    // 🟨 JavaScript Family
    js: { Icon: FileCode, color: "#F7DF1E", label: "JS" },
    jsx: { Icon: FileCode, color: "#61DAFB", label: "JSX" },
    mjs: { Icon: FileCode, color: "#F7DF1E", label: "MJS" },
    cjs: { Icon: FileCode, color: "#F7DF1E", label: "CJS" },

    // 🔵 TypeScript Family
    ts: { Icon: FileCode, color: "#3178C6", label: "TS" },
    tsx: { Icon: FileCode, color: "#3178C6", label: "TSX" },
    dts: { Icon: FileCode, color: "#3178C6", label: "D.TS" },

    // 🌐 Web Technologies
    html: { Icon: FileType2, color: "#E34F26", label: "HTML" },
    htm: { Icon: FileType2, color: "#E34F26", label: "HTML" },
    css: { Icon: Palette, color: "#1572B6", label: "CSS" },
    scss: { Icon: Palette, color: "#CC6699", label: "SCSS" },
    sass: { Icon: Palette, color: "#CC6699", label: "SASS" },
    less: { Icon: Palette, color: "#1D365D", label: "LESS" },
    vue: { Icon: FileCode, color: "#4FC08D", label: "VUE" },
    svelte: { Icon: FileCode, color: "#FF3E00", label: "SV" },

    // 📄 Documents
    pdf: { Icon: FileBadge, color: "#EA4335", label: "PDF" },
    doc: { Icon: FileText, color: "#2B579A", label: "DOC" },
    docx: { Icon: FileText, color: "#2B579A", label: "DOCX" },
    txt: { Icon: FileText, color: "#5C6BC0", label: "TXT" },
    md: { Icon: FileText, color: "#083FA1", label: "MD" },
    rtf: { Icon: FileText, color: "#B71C1C", label: "RTF" },

    // 📊 Spreadsheets & Presentations
    xls: { Icon: FileSpreadsheet, color: "#217346", label: "XLS" },
    xlsx: { Icon: FileSpreadsheet, color: "#217346", label: "XLSX" },
    csv: { Icon: FileSpreadsheet, color: "#217346", label: "CSV" },
    ppt: { Icon: FileBadge, color: "#D24726", label: "PPT" },
    pptx: { Icon: FileBadge, color: "#D24726", label: "PPTX" },

    // 🗜️ Archives
    zip: { Icon: FileArchive, color: "#FF9800", label: "ZIP" },
    rar: { Icon: FileArchive, color: "#0066CC", label: "RAR" },
    "7z": { Icon: FileArchive, color: "#4FC3F7", label: "7Z" },
    tar: { Icon: FileArchive, color: "#FFB300", label: "TAR" },
    gz: { Icon: FileArchive, color: "#FFB300", label: "GZ" },

    // 🎨 Images
    jpg: { Icon: FileImage, color: "#4CAF50", label: "JPG" },
    jpeg: { Icon: FileImage, color: "#4CAF50", label: "JPG" },
    png: { Icon: FileImage, color: "#2196F3", label: "PNG" },
    gif: { Icon: FileImage, color: "#FF9800", label: "GIF" },
    webp: { Icon: FileImage, color: "#4CAF50", label: "WEBP" },
    svg: { Icon: FileImage, color: "#FFB300", label: "SVG" },
    ico: { Icon: FileImage, color: "#9E9E9E", label: "ICO" },
    avif: { Icon: FileImage, color: "#4CAF50", label: "AVIF" },

    // 🎬 Media
    mp4: { Icon: FileVideo, color: "#FF5722", label: "MP4" },
    avi: { Icon: FileVideo, color: "#FF5722", label: "AVI" },
    mov: { Icon: FileVideo, color: "#3F51B5", label: "MOV" },
    mkv: { Icon: FileVideo, color: "#9C27B0", label: "MKV" },
    webm: { Icon: FileVideo, color: "#4CAF50", label: "WEBM" },
    mp3: { Icon: FileAudio, color: "#E91E63", label: "MP3" },
    wav: { Icon: FileAudio, color: "#607D8B", label: "WAV" },
    flac: { Icon: FileAudio, color: "#9C27B0", label: "FLAC" },

    // 💻 Config & Data
    json: { Icon: FileJson, color: "#FFC107", label: "JSON" },
    xml: { Icon: FileCode, color: "#FF5722", label: "XML" },
    yaml: { Icon: FileCode, color: "#CB171E", label: "YAML" },
    yml: { Icon: FileCode, color: "#CB171E", label: "YML" },
    toml: { Icon: FileCode, color: "#9C4221", label: "TOML" },
    ini: { Icon: Settings, color: "#607D8B", label: "INI" },
    env: { Icon: Lock, color: "#4CAF50", label: "ENV" },
    key: { Icon: Key, color: "#FF9800", label: "KEY" },
    pem: { Icon: Lock, color: "#9C27B0", label: "PEM" },

    // 🗄️ Database
    sql: { Icon: Database, color: "#FF9800", label: "SQL" },
    db: { Icon: Database, color: "#2196F3", label: "DB" },
    sqlite: { Icon: Database, color: "#003B57", label: "SQLITE" },
    mongo: { Icon: Database, color: "#47A248", label: "MONGO" },

    // 🐍 Languages
    py: { Icon: Terminal, color: "#3776AB", label: "PY" },
    pyw: { Icon: Terminal, color: "#3776AB", label: "PYW" },
    ipynb: { Icon: FileCode, color: "#F37626", label: "IPYNB" },
    java: { Icon: FileCode, color: "#007396", label: "JAVA" },
    class: { Icon: FileCode, color: "#007396", label: "CLASS" },
    jar: { Icon: FileArchive, color: "#007396", label: "JAR" },
    kt: { Icon: FileCode, color: "#7F52FF", label: "KT" },
    kts: { Icon: FileCode, color: "#7F52FF", label: "KTS" },
    scala: { Icon: FileCode, color: "#DC322F", label: "SCALA" },
    go: { Icon: FileCode, color: "#00ADD8", label: "GO" },
    rs: { Icon: FileCode, color: "#DEA584", label: "RS" },
    php: { Icon: FileCode, color: "#777BB4", label: "PHP" },
    rb: { Icon: FileCode, color: "#CC342D", label: "RB" },
    swift: { Icon: FileCode, color: "#FA7343", label: "SWIFT" },
    dart: { Icon: FileCode, color: "#0175C2", label: "DART" },
    r: { Icon: FileCode, color: "#276DC3", label: "R" },
    sh: { Icon: Terminal, color: "#4EAA25", label: "SH" },
    bash: { Icon: Terminal, color: "#4EAA25", label: "BASH" },
    zsh: { Icon: Terminal, color: "#4EAA25", label: "ZSH" },
    ps1: { Icon: Terminal, color: "#5391FE", label: "PS1" },

    // 📦 Package & Build
    package: { Icon: Package, color: "#CB3837", label: "PKG" },
    lock: { Icon: Lock, color: "#FF9800", label: "LOCK" },
    config: { Icon: Settings, color: "#607D8B", label: "CFG" },
    webpack: { Icon: Package, color: "#8DD6F9", label: "WEBPACK" },
    vite: { Icon: Package, color: "#646CFF", label: "VITE" },

    // ☁️ Cloud & DevOps
    dockerfile: { Icon: Cloud, color: "#2496ED", label: "DOCKER" },
    dockerignore: { Icon: Cloud, color: "#2496ED", label: "DOCKER" },
    yml: { Icon: Cloud, color: "#2496ED", label: "YML" },
    tf: { Icon: Cloud, color: "#7B42BC", label: "TF" },
    tfvars: { Icon: Cloud, color: "#7B42BC", label: "TFVARS" },

    // 🔀 Version Control
    gitignore: { Icon: GitBranch, color: "#F05032", label: "GIT" },
    gitattributes: { Icon: GitBranch, color: "#F05032", label: "GIT" },
  };

  // ✅ Check exact extension match
  if (iconMap[ext]) {
    return {
      Icon: iconMap[ext].Icon,
      color: iconMap[ext].color,
      label: iconMap[ext].label,
    };
  }

  // ✅ Fallback: Generic categories
  if (
    ["jpg", "jpeg", "png", "gif", "webp", "svg", "ico", "avif"].includes(ext)
  ) {
    return { Icon: FileImage, color: "#4CAF50", label: "IMG" };
  }
  if (["js", "jsx", "ts", "tsx", "mjs", "cjs"].includes(ext)) {
    return { Icon: FileCode, color: "#F7DF1E", label: "CODE" };
  }
  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(ext)) {
    return { Icon: FileArchive, color: "#FF9800", label: "ARCH" };
  }
  if (["mp4", "avi", "mov", "mkv", "webm"].includes(ext)) {
    return { Icon: FileVideo, color: "#FF5722", label: "VID" };
  }
  if (["mp3", "wav", "flac", "ogg"].includes(ext)) {
    return { Icon: FileAudio, color: "#E91E63", label: "AUD" };
  }

  // 🎯 Default fallback
  return { Icon: File, color: "#94a3b8", label: "FILE" };
};

export const getFileNameFromUrl = (url) => {
  if (!url) return "";
  return url.split("/").pop(); // last part of URL
};

export const safeParse = (obj) => {
  return typeof obj === "string" ? JSON.parse(obj) : obj;
};
