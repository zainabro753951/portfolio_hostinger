import { toast } from 'react-toastify'
import { useAddVisitors } from '../Queries/AddVisitors'

export function colorGuess(lang) {
  const lower = lang?.toLowerCase()

  if (lower.includes('javascript') || lower.includes('js')) return '#F7DF1E' // JS
  if (lower.includes('python') || lower.includes('py')) return '#3776AB' // Python
  if (lower.includes('react')) return '#61DAFB' // JSX
  if (lower.includes('typescript') || lower.includes('ts') || lower.includes('typescript'))
    return '#3178C6' // TS

  return '#000000' // default
}

// 🔹 Helper function to convert object to FormData (recursively)
export function appendFormData(formData, data, parentKey = '') {
  if (data instanceof File || data instanceof Blob) {
    formData.append(parentKey, data)
  } else if (Array.isArray(data)) {
    data.forEach((value, index) => {
      appendFormData(formData, value, `${parentKey}[${index}]`)
    })
  } else if (data && typeof data === 'object') {
    Object.keys(data).forEach(key => {
      appendFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key)
    })
  } else {
    formData.append(parentKey, data ?? '')
  }
}

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
  ]

  // ✅ Return only those skills that match any frontend skill
  return skills?.filter(userSkill =>
    frontendSkillNames.some(skill => skill.toLowerCase() === userSkill.toLowerCase())
  )
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
  ]

  return skills?.filter(userSkill =>
    backendSkillNames?.some(skill => skill?.toLowerCase() === userSkill?.toLowerCase())
  )
}

export const capitalize = str => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '')
