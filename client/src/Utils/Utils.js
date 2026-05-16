import DOMPurify from 'dompurify';
import {
  Activity,
  AppWindow,
  Atom,
  BarChart3,
  Beaker,
  Bell,
  Blocks,
  Bot,
  Box,
  Brain,
  Briefcase,
  Bug,
  Building2,
  Cable,
  Calendar,
  Camera,
  ChartBar,
  CheckCircle,
  Chrome,
  CircuitBoard,
  Cloud,
  CloudCog,
  Code2,
  Coffee,
  Cog,
  Component,
  Cpu,
  Database,
  File,
  FileArchive,
  FileAudio,
  FileBadge,
  FileCode,
  FileImage,
  FileJson,
  FileSpreadsheet,
  FileText,
  FileType2,
  FileVideo,
  Fingerprint,
  Flame,
  Gauge,
  GitBranch,
  Github,
  Globe,
  Grid2x2,
  HardDrive,
  HeartPulse,
  Image,
  Infinity,
  Key,
  Keyboard,
  Laptop,
  Layers,
  LayoutDashboard,
  Link,
  Lock,
  Mail,
  MessageSquare,
  Monitor,
  Moon,
  MousePointer,
  Network,
  Package,
  Palette,
  PanelTop,
  PenTool,
  Phone,
  Play,
  Plug,
  Radio,
  Rocket,
  Route,
  Search,
  Server,
  Settings,
  Shield,
  ShoppingCart,
  Smartphone,
  Sparkles,
  SquareTerminal,
  Star,
  Store,
  Sun,
  Tablet,
  Terminal,
  Timer,
  Tv,
  Usb,
  User,
  Users,
  Video,
  Wallet,
  Webhook,
  Wifi,
  Workflow,
  Wrench,
  Zap,
} from 'lucide-react';
import { marked } from 'marked';

// utils/timeUtils.js
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// ✅ User ka timezone detect karo (browser se)
export const getUserTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

// ✅ Relative time with timezone fix
export const formatTimeAgo = (date, fallback = 'Unknown') => {
  if (!date) return fallback;

  // UTC se user ke local timezone mein convert karo
  const userTz = getUserTimezone();
  const parsed = dayjs.utc(date).tz(userTz);

  if (!parsed.isValid()) return fallback;
  return parsed.fromNow();
};

// ✅ Exact date format bhi timezone ke saath
export const formatDateTime = (date, format = 'DD MMM YYYY, hh:mm A') => {
  if (!date) return '—';
  const userTz = getUserTimezone();
  return dayjs.utc(date).tz(userTz).format(format);
};

export function colorGuess(lang) {
  const lower = lang?.toLowerCase();

  if (lower.includes('javascript') || lower.includes('js')) return '#F7DF1E'; // JS
  if (lower.includes('python') || lower.includes('py')) return '#3776AB'; // Python
  if (lower.includes('react')) return '#61DAFB'; // JSX
  if (lower.includes('typescript') || lower.includes('ts') || lower.includes('typescript'))
    return '#3178C6'; // TS

  return '#000000'; // default
}

// ============================================
// SAFE appendFormData — Handles all data types
// ============================================

const isFile = (value) => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.name === 'string' &&
    typeof value.size === 'number' &&
    typeof value.type === 'string'
  );
};

/**
 * Safely checks if value is a Blob
 */
const isBlob = (value) => {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.size === 'number' &&
    typeof value.type === 'string'
  );
};

export const appendFormData = (formData, data, parentKey = '') => {
  if (data === null || data === undefined) {
    formData.append(parentKey, '');
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
  if (typeof data === 'object') {
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
export const appendFormDataFlat = (formData, data, parentKey = '') => {
  if (data === null || data === undefined) {
    formData.append(parentKey, '');
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

  if (typeof data === 'object') {
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
    'HTML',
    'CSS',
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Redux',
    'Tailwind CSS',
    'Bootstrap',
    'SASS/SCSS',
    'Material UI',
    'Framer Motion',
    'GSAP',
    'Locomotive Scroll',
    'Lenis Scroll',
    'Three.js',
    'Vite',
    'Webpack',
    'Parcel',
    'Git',
    'GitHub',
    'Responsive Design',
    'UI/UX Principles',
    'Figma',
    'Photoshop',
    'Performance Optimization',
    'Cross-Browser Compatibility',
    'RESTful APIs',
    'JSON',
    'AJAX',
    'npm / yarn',
    'ES6+',
    'DOM Manipulation',
    'Accessibility (a11y)',
    'Testing (Jest, React Testing Library)',
    'Firebase Hosting',
    'Netlify',
    'Vercel',
    'Code Optimization',
    'Modern UI Design',
  ];

  // ✅ Return only those skills that match any frontend skill
  return skills?.filter((userSkill) =>
    frontendSkillNames.some((skill) => skill.toLowerCase() === userSkill.toLowerCase())
  );
}

export function backendSkillFilter(skills) {
  const backendSkillNames = [
    'Node.js',
    'Express.js',
    'MongoDB',
    'Mongoose',
    'MySQL',
    'PostgreSQL',
    'SQLite',
    'Prisma',
    'Sequelize',
    'RESTful APIs',
    'GraphQL',
    'Apollo Server',
    'Next.js API Routes',
    'Authentication (JWT, OAuth, Passport.js)',
    'Bcrypt',
    'Session Management',
    'Cookies Handling',
    'Error Handling & Logging',
    'File Upload (Multer, Cloudinary)',
    'Socket.io (Real-time Communication)',
    'WebSockets',
    'Redis',
    'Caching',
    'Rate Limiting',
    'API Security (Helmet, CORS, CSRF)',
    'Validation (Joi, Express Validator, Zod)',
    'Environment Variables (.env)',
    'MVC Architecture',
    'Microservices',
    'Serverless Functions',
    'Firebase Admin SDK',
    'Cloud Functions',
    'AWS',
    'Google Cloud',
    'Docker',
    'EC2',
    'S3',
    'Lambda',
    'CI/CD Pipelines (GitHub Actions, Jenkins)',
    'Testing (Mocha, Chai, Jest, Supertest)',
    'Performance Optimization',
    'Database Design',
    'Data Modeling',
    'Error Tracking (Sentry)',
    'Version Control (Git)',
    'CLI Tools (Nodemon, PM2)',
    'Web Security Best Practices',
  ];

  return skills?.filter((userSkill) =>
    backendSkillNames?.some((skill) => skill?.toLowerCase() === userSkill?.toLowerCase())
  );
}

export const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');

// Utils.js

export const getFileIcon = (fileName) => {
  if (!fileName) return { Icon: File, color: '#94a3b8', label: 'File' };

  const ext = fileName.split('.').pop()?.toLowerCase();
  const name = fileName.split('/').pop()?.split('\\').pop() || fileName;

  // 🎨 Extension → Icon + Color + Label mapping
  const iconMap = {
    // 🟨 JavaScript Family
    js: { Icon: FileCode, color: '#F7DF1E', label: 'JS' },
    jsx: { Icon: FileCode, color: '#61DAFB', label: 'JSX' },
    mjs: { Icon: FileCode, color: '#F7DF1E', label: 'MJS' },
    cjs: { Icon: FileCode, color: '#F7DF1E', label: 'CJS' },

    // 🔵 TypeScript Family
    ts: { Icon: FileCode, color: '#3178C6', label: 'TS' },
    tsx: { Icon: FileCode, color: '#3178C6', label: 'TSX' },
    dts: { Icon: FileCode, color: '#3178C6', label: 'D.TS' },

    // 🌐 Web Technologies
    html: { Icon: FileType2, color: '#E34F26', label: 'HTML' },
    htm: { Icon: FileType2, color: '#E34F26', label: 'HTML' },
    css: { Icon: Palette, color: '#1572B6', label: 'CSS' },
    scss: { Icon: Palette, color: '#CC6699', label: 'SCSS' },
    sass: { Icon: Palette, color: '#CC6699', label: 'SASS' },
    less: { Icon: Palette, color: '#1D365D', label: 'LESS' },
    vue: { Icon: FileCode, color: '#4FC08D', label: 'VUE' },
    svelte: { Icon: FileCode, color: '#FF3E00', label: 'SV' },

    // 📄 Documents
    pdf: { Icon: FileBadge, color: '#EA4335', label: 'PDF' },
    doc: { Icon: FileText, color: '#2B579A', label: 'DOC' },
    docx: { Icon: FileText, color: '#2B579A', label: 'DOCX' },
    txt: { Icon: FileText, color: '#5C6BC0', label: 'TXT' },
    md: { Icon: FileText, color: '#083FA1', label: 'MD' },
    rtf: { Icon: FileText, color: '#B71C1C', label: 'RTF' },

    // 📊 Spreadsheets & Presentations
    xls: { Icon: FileSpreadsheet, color: '#217346', label: 'XLS' },
    xlsx: { Icon: FileSpreadsheet, color: '#217346', label: 'XLSX' },
    csv: { Icon: FileSpreadsheet, color: '#217346', label: 'CSV' },
    ppt: { Icon: FileBadge, color: '#D24726', label: 'PPT' },
    pptx: { Icon: FileBadge, color: '#D24726', label: 'PPTX' },

    // 🗜️ Archives
    zip: { Icon: FileArchive, color: '#FF9800', label: 'ZIP' },
    rar: { Icon: FileArchive, color: '#0066CC', label: 'RAR' },
    '7z': { Icon: FileArchive, color: '#4FC3F7', label: '7Z' },
    tar: { Icon: FileArchive, color: '#FFB300', label: 'TAR' },
    gz: { Icon: FileArchive, color: '#FFB300', label: 'GZ' },

    // 🎨 Images
    jpg: { Icon: FileImage, color: '#4CAF50', label: 'JPG' },
    jpeg: { Icon: FileImage, color: '#4CAF50', label: 'JPG' },
    png: { Icon: FileImage, color: '#2196F3', label: 'PNG' },
    gif: { Icon: FileImage, color: '#FF9800', label: 'GIF' },
    webp: { Icon: FileImage, color: '#4CAF50', label: 'WEBP' },
    svg: { Icon: FileImage, color: '#FFB300', label: 'SVG' },
    ico: { Icon: FileImage, color: '#9E9E9E', label: 'ICO' },
    avif: { Icon: FileImage, color: '#4CAF50', label: 'AVIF' },

    // 🎬 Media
    mp4: { Icon: FileVideo, color: '#FF5722', label: 'MP4' },
    avi: { Icon: FileVideo, color: '#FF5722', label: 'AVI' },
    mov: { Icon: FileVideo, color: '#3F51B5', label: 'MOV' },
    mkv: { Icon: FileVideo, color: '#9C27B0', label: 'MKV' },
    webm: { Icon: FileVideo, color: '#4CAF50', label: 'WEBM' },
    mp3: { Icon: FileAudio, color: '#E91E63', label: 'MP3' },
    wav: { Icon: FileAudio, color: '#607D8B', label: 'WAV' },
    flac: { Icon: FileAudio, color: '#9C27B0', label: 'FLAC' },

    // 💻 Config & Data
    json: { Icon: FileJson, color: '#FFC107', label: 'JSON' },
    xml: { Icon: FileCode, color: '#FF5722', label: 'XML' },
    yaml: { Icon: FileCode, color: '#CB171E', label: 'YAML' },
    yml: { Icon: FileCode, color: '#CB171E', label: 'YML' },
    toml: { Icon: FileCode, color: '#9C4221', label: 'TOML' },
    ini: { Icon: Settings, color: '#607D8B', label: 'INI' },
    env: { Icon: Lock, color: '#4CAF50', label: 'ENV' },
    key: { Icon: Key, color: '#FF9800', label: 'KEY' },
    pem: { Icon: Lock, color: '#9C27B0', label: 'PEM' },

    // 🗄️ Database
    sql: { Icon: Database, color: '#FF9800', label: 'SQL' },
    db: { Icon: Database, color: '#2196F3', label: 'DB' },
    sqlite: { Icon: Database, color: '#003B57', label: 'SQLITE' },
    mongo: { Icon: Database, color: '#47A248', label: 'MONGO' },

    // 🐍 Languages
    py: { Icon: Terminal, color: '#3776AB', label: 'PY' },
    pyw: { Icon: Terminal, color: '#3776AB', label: 'PYW' },
    ipynb: { Icon: FileCode, color: '#F37626', label: 'IPYNB' },
    java: { Icon: FileCode, color: '#007396', label: 'JAVA' },
    class: { Icon: FileCode, color: '#007396', label: 'CLASS' },
    jar: { Icon: FileArchive, color: '#007396', label: 'JAR' },
    kt: { Icon: FileCode, color: '#7F52FF', label: 'KT' },
    kts: { Icon: FileCode, color: '#7F52FF', label: 'KTS' },
    scala: { Icon: FileCode, color: '#DC322F', label: 'SCALA' },
    go: { Icon: FileCode, color: '#00ADD8', label: 'GO' },
    rs: { Icon: FileCode, color: '#DEA584', label: 'RS' },
    php: { Icon: FileCode, color: '#777BB4', label: 'PHP' },
    rb: { Icon: FileCode, color: '#CC342D', label: 'RB' },
    swift: { Icon: FileCode, color: '#FA7343', label: 'SWIFT' },
    dart: { Icon: FileCode, color: '#0175C2', label: 'DART' },
    r: { Icon: FileCode, color: '#276DC3', label: 'R' },
    sh: { Icon: Terminal, color: '#4EAA25', label: 'SH' },
    bash: { Icon: Terminal, color: '#4EAA25', label: 'BASH' },
    zsh: { Icon: Terminal, color: '#4EAA25', label: 'ZSH' },
    ps1: { Icon: Terminal, color: '#5391FE', label: 'PS1' },

    // 📦 Package & Build
    package: { Icon: Package, color: '#CB3837', label: 'PKG' },
    lock: { Icon: Lock, color: '#FF9800', label: 'LOCK' },
    config: { Icon: Settings, color: '#607D8B', label: 'CFG' },
    webpack: { Icon: Package, color: '#8DD6F9', label: 'WEBPACK' },
    vite: { Icon: Package, color: '#646CFF', label: 'VITE' },

    // ☁️ Cloud & DevOps
    dockerfile: { Icon: Cloud, color: '#2496ED', label: 'DOCKER' },
    dockerignore: { Icon: Cloud, color: '#2496ED', label: 'DOCKER' },
    yml: { Icon: Cloud, color: '#2496ED', label: 'YML' },
    tf: { Icon: Cloud, color: '#7B42BC', label: 'TF' },
    tfvars: { Icon: Cloud, color: '#7B42BC', label: 'TFVARS' },

    // 🔀 Version Control
    gitignore: { Icon: GitBranch, color: '#F05032', label: 'GIT' },
    gitattributes: { Icon: GitBranch, color: '#F05032', label: 'GIT' },
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
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'avif'].includes(ext)) {
    return { Icon: FileImage, color: '#4CAF50', label: 'IMG' };
  }
  if (['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'].includes(ext)) {
    return { Icon: FileCode, color: '#F7DF1E', label: 'CODE' };
  }
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(ext)) {
    return { Icon: FileArchive, color: '#FF9800', label: 'ARCH' };
  }
  if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext)) {
    return { Icon: FileVideo, color: '#FF5722', label: 'VID' };
  }
  if (['mp3', 'wav', 'flac', 'ogg'].includes(ext)) {
    return { Icon: FileAudio, color: '#E91E63', label: 'AUD' };
  }

  // 🎯 Default fallback
  return { Icon: File, color: '#94a3b8', label: 'FILE' };
};

export const getFileNameFromUrl = (url) => {
  if (!url) return '';
  return url.split('/').pop(); // last part of URL
};

export const safeParse = (obj) => {
  return typeof obj === 'string' ? JSON.parse(obj) : obj;
};

export const scrollToRef = (ref, options = {}) => {
  // ✅ Safety: ref exist karta hai?
  if (!ref?.current) {
    console.warn('⚠️ scrollToRef: ref.current is null or undefined');
    return;
  }

  // ✅ Default options merge
  const scrollOptions = {
    behavior: 'smooth',
    block: 'nearest', // ✅ "nearest" better UX for partial visibility
    inline: 'nearest',
    ...options,
  };

  // ✅ Execute scroll
  ref.current.scrollIntoView(scrollOptions);
};

export const renderMarkdown = (text) => {
  if (!text) {
    console.log('No text provided, returning empty string');
    return '';
  }

  const raw = text
    .replace(/\\n/g, '\n')
    .replace(/\r/g, '') // Windows line endings remove karo
    .trim();

  try {
    const html = marked(raw);
    return DOMPurify.sanitize(html);
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return text; // Fallback: raw text return karo
  }
};

export const SERVICE_COLOR_PALETTES = [
  {
    color: 'from-blue-500 to-cyan-400',
    gradient: 'from-blue-500/20 to-cyan-400/20',
    iconBg: 'bg-blue-500',
  },
  {
    color: 'from-purple-500 to-pink-500',
    gradient: 'from-purple-500/20 to-pink-500/20',
    iconBg: 'bg-purple-500',
  },
  {
    color: 'from-amber-500 to-orange-500',
    gradient: 'from-amber-500/20 to-orange-500/20',
    iconBg: 'bg-amber-500',
  },
  {
    color: 'from-emerald-500 to-teal-500',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    iconBg: 'bg-emerald-500',
  },
  {
    color: 'from-rose-500 to-red-500',
    gradient: 'from-rose-500/20 to-red-500/20',
    iconBg: 'bg-rose-500',
  },
  {
    color: 'from-indigo-500 to-violet-500',
    gradient: 'from-indigo-500/20 to-violet-500/20',
    iconBg: 'bg-indigo-500',
  },
  {
    color: 'from-cyan-500 to-sky-500',
    gradient: 'from-cyan-500/20 to-sky-500/20',
    iconBg: 'bg-cyan-500',
  },
  {
    color: 'from-lime-500 to-green-500',
    gradient: 'from-lime-500/20 to-green-500/20',
    iconBg: 'bg-lime-500',
  },
  {
    color: 'from-fuchsia-500 to-purple-500',
    gradient: 'from-fuchsia-500/20 to-purple-500/20',
    iconBg: 'bg-fuchsia-500',
  },
  {
    color: 'from-yellow-500 to-amber-500',
    gradient: 'from-yellow-500/20 to-amber-500/20',
    iconBg: 'bg-yellow-500',
  },
  {
    color: 'from-teal-500 to-emerald-400',
    gradient: 'from-teal-500/20 to-emerald-400/20',
    iconBg: 'bg-teal-500',
  },
  {
    color: 'from-violet-500 to-indigo-500',
    gradient: 'from-violet-500/20 to-indigo-500/20',
    iconBg: 'bg-violet-500',
  },
  {
    color: 'from-pink-500 to-rose-500',
    gradient: 'from-pink-500/20 to-rose-500/20',
    iconBg: 'bg-pink-500',
  },
  {
    color: 'from-sky-500 to-blue-500',
    gradient: 'from-sky-500/20 to-blue-500/20',
    iconBg: 'bg-sky-500',
  },
  {
    color: 'from-orange-500 to-red-500',
    gradient: 'from-orange-500/20 to-red-500/20',
    iconBg: 'bg-orange-500',
  },
  {
    color: 'from-green-500 to-lime-400',
    gradient: 'from-green-500/20 to-lime-400/20',
    iconBg: 'bg-green-500',
  },
  {
    color: 'from-red-500 to-rose-500',
    gradient: 'from-red-500/20 to-rose-500/20',
    iconBg: 'bg-red-500',
  },
  {
    color: 'from-blue-600 to-purple-500',
    gradient: 'from-blue-600/20 to-purple-500/20',
    iconBg: 'bg-blue-600',
  },
  {
    color: 'from-purple-600 to-fuchsia-500',
    gradient: 'from-purple-600/20 to-fuchsia-500/20',
    iconBg: 'bg-purple-600',
  },
  {
    color: 'from-cyan-600 to-teal-500',
    gradient: 'from-cyan-600/20 to-teal-500/20',
    iconBg: 'bg-cyan-600',
  },
];
export const SERVICE_GRADIENTS = [
  'linear-gradient(135deg, #4e90e1, #02d3fe)',
  'linear-gradient(135deg, #9a5cb7, #ec4899)',
  'linear-gradient(135deg, #02d3fe, #4e90e1)',
  'linear-gradient(135deg, #f59e0b, #02d3fe)',
];

export const techIcons = [
  { type: 'reactjs', icon: Atom },
  { type: 'nextjs', icon: Rocket },
  { type: 'javascript', icon: FileCode },
  { type: 'typescript', icon: SquareTerminal },
  { type: 'nodejs', icon: Server },
  { type: 'express', icon: Route },
  { type: 'mongodb', icon: Database },
  { type: 'mysql', icon: Database },
  { type: 'postgresql', icon: Database },
  { type: 'firebase', icon: Flame },
  { type: 'tailwindcss', icon: Palette },
  { type: 'bootstrap', icon: LayoutDashboard },
  { type: 'html', icon: Code2 },
  { type: 'css', icon: PenTool },
  { type: 'redux', icon: Workflow },
  { type: 'vite', icon: Zap },
  { type: 'webpack', icon: Package },
  { type: 'git', icon: GitBranch },
  { type: 'github', icon: Github },
  { type: 'api', icon: Webhook },
  { type: 'restapi', icon: Link },
  { type: 'graphql', icon: Network },
  { type: 'socketio', icon: Radio },
  { type: 'docker', icon: Box },
  { type: 'aws', icon: Cloud },
  { type: 'azure', icon: CloudCog },
  { type: 'linux', icon: Terminal },
  { type: 'ubuntu', icon: Laptop },
  { type: 'nginx', icon: Shield },
  { type: 'vercel', icon: Rocket },
  { type: 'netlify', icon: Globe },
  { type: 'figma', icon: PenTool },
  { type: 'photoshop', icon: Image },
  { type: 'illustrator', icon: Palette },
  { type: 'framer-motion', icon: Activity },
  { type: 'gsap', icon: Timer },
  { type: 'threejs', icon: Blocks },
  { type: 'cpp', icon: Cpu },
  { type: 'c', icon: CircuitBoard },
  { type: 'java', icon: Coffee },
  { type: 'python', icon: Bot },
  { type: 'php', icon: FileJson },
  { type: 'laravel', icon: Building2 },
  { type: 'django', icon: Shield },
  { type: 'flask', icon: Beaker },
  { type: 'swift', icon: Smartphone },
  { type: 'kotlin', icon: Smartphone },
  { type: 'android', icon: Phone },
  { type: 'ios', icon: Tablet },
  { type: 'chrome-extension', icon: Chrome },
  { type: 'seo', icon: Search },
  { type: 'performance', icon: Gauge },
  { type: 'security', icon: Lock },
  { type: 'authentication', icon: Fingerprint },
  { type: 'dashboard', icon: PanelTop },
  { type: 'cms', icon: Layers },
  { type: 'ecommerce', icon: ShoppingCart },
  { type: 'portfolio', icon: Briefcase },
  { type: 'blog', icon: MessageSquare },
  { type: 'chatapp', icon: Users },
  { type: 'video', icon: Video },
  { type: 'streaming', icon: Tv },
  { type: 'ai', icon: Brain },
  { type: 'machine-learning', icon: Brain },
  { type: 'automation', icon: Cog },
  { type: 'analytics', icon: ChartBar },
  { type: 'testing', icon: Bug },
  { type: 'uiux', icon: Sparkles },
  { type: 'design-system', icon: Grid2x2 },
  { type: 'darkmode', icon: Moon },
  { type: 'lightmode', icon: Sun },
  { type: 'responsive', icon: Monitor },
  { type: 'mobile', icon: Smartphone },
  { type: 'desktop', icon: Laptop },
  { type: 'webapp', icon: AppWindow },
  { type: 'saas', icon: Wallet },
  { type: 'cloud', icon: Cloud },
  { type: 'hosting', icon: HardDrive },
  { type: 'websocket', icon: Wifi },
  { type: 'cli', icon: Terminal },
  { type: 'npm', icon: Package },
  { type: 'yarn', icon: Cable },
  { type: 'pnpm', icon: Plug },
  { type: 'browser', icon: Globe },
  { type: 'animation', icon: Play },
  { type: 'components', icon: Component },
  { type: 'forms', icon: CheckCircle },
  { type: 'notifications', icon: Bell },
  { type: 'email', icon: Mail },
  { type: 'calendar', icon: Calendar },
  { type: 'camera', icon: Camera },
  { type: 'realtime', icon: Activity },
  { type: 'payments', icon: Wallet },
  { type: 'admin-panel', icon: LayoutDashboard },
  { type: 'startup', icon: Rocket },
  { type: 'tools', icon: Wrench },
  { type: 'opensource', icon: Infinity },
  { type: 'terminal', icon: SquareTerminal },
  { type: 'keyboard', icon: Keyboard },
  { type: 'mouse', icon: MousePointer },
  { type: 'usb', icon: Usb },
  { type: 'monitoring', icon: HeartPulse },
  { type: 'statistics', icon: BarChart3 },
  { type: 'profile', icon: User },
  { type: 'startup-kit', icon: Star },
  { type: 'store', icon: Store },
];

// Option 2: Sirf 'color' values ki array (jo TESTIMONIAL_GRADIENTS jaisi structure chahiye)
export const TESTIMONIAL_GRADIENTS = [
  'linear-gradient(135deg, #3b82f6, #22d3ee)', // blue-500 -> cyan-400
  'linear-gradient(135deg, #a855f7, #ec4899)', // purple-500 -> pink-500
  'linear-gradient(135deg, #f59e0b, #f97316)', // amber-500 -> orange-500
  'linear-gradient(135deg, #10b981, #14b8a6)', // emerald-500 -> teal-500
  'linear-gradient(135deg, #f43f5e, #ef4444)', // rose-500 -> red-500
  'linear-gradient(135deg, #6366f1, #8b5cf6)', // indigo-500 -> violet-500
  'linear-gradient(135deg, #06b6d4, #0ea5e9)', // cyan-500 -> sky-500
  'linear-gradient(135deg, #84cc16, #22c55e)', // lime-500 -> green-500
  'linear-gradient(135deg, #d946ef, #a855f7)', // fuchsia-500 -> purple-500
  'linear-gradient(135deg, #eab308, #f59e0b)', // yellow-500 -> amber-500
  'linear-gradient(135deg, #14b8a6, #34d399)', // teal-500 -> emerald-400
  'linear-gradient(135deg, #8b5cf6, #6366f1)', // violet-500 -> indigo-500
  'linear-gradient(135deg, #ec4899, #f43f5e)', // pink-500 -> rose-500
  'linear-gradient(135deg, #0ea5e9, #3b82f6)', // sky-500 -> blue-500
  'linear-gradient(135deg, #f97316, #ef4444)', // orange-500 -> red-500
  'linear-gradient(135deg, #22c55e, #a3e635)', // green-500 -> lime-400
  'linear-gradient(135deg, #ef4444, #f43f5e)', // red-500 -> rose-500
  'linear-gradient(135deg, #2563eb, #a855f7)', // blue-600 -> purple-500
  'linear-gradient(135deg, #9333ea, #d946ef)', // purple-600 -> fuchsia-500
  'linear-gradient(135deg, #0891b2, #14b8a6)', // cyan-600 -> teal-500
];

export const getClientSatisfactionRate = (testimonial) => {
  return Math.round(
    (testimonial.filter((t) => t?.rating >= 4 || t?.ratting >= 4).length / testimonial.length) * 100
  );
};


export function formatDuration(days) {
  if (days >= 30) {
    const months = Math.floor(days / 30);

    return `${months} month${months > 1 ? "s" : ""}`;
  }

  return `${days} day${days > 1 ? "s" : ""}`;
}