import dotenv from 'dotenv'
dotenv.config()

import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'

import logger from './Utils/logger.js'
import errorHandler from './middlewares/errorHandler.js'

// Routes
import aboutRoute from './Routes/about.route.js'
import adminRoute from './Routes/admin.route.js'
import contactMsgRoute from './Routes/contactMsg.route.js'
import educationRoute from './Routes/education.route.js'
import expRoute from './Routes/experience.route.js'
import faqsRoute from './Routes/faqs.route.js'
import pricePlanRoute from './Routes/pricePlan.route.js'
import projectsRoute from './Routes/projects.route.js'
import activitiesRoute from './Routes/recentActivities.route.js'
import serviceRoute from './Routes/services.route.js'
import siteSettingsRoute from './Routes/siteSettings.route.js'
import skillsRoute from './Routes/skills.route.js'
import testiRoute from './Routes/testimonials.route.js'
import visitorsRoute from './Routes/visitors.route.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const isProduction = process.env.NODE_ENV === 'production'

/* =========================
   Trust Proxy (Hostinger)
========================= */
app.set('trust proxy', isProduction ? 1 : 0)

/* =========================
   Security: Helmet (Environment-Based)
========================= */
if (!isProduction) {
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
      originAgentCluster: false,
    })
  )
} else {
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", 'https://*.google.com'],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:', 'http:'],
          connectSrc: [
            "'self'",
            'https://www.zaincode.io',
            'https://zaincode.io',
            'https://api.zaincode.io',
          ],
          frameSrc: ["'self'", 'https://www.youtube.com'],
        },
      },
      strictTransportSecurity: { maxAge: 31536000, includeSubDomains: true, preload: true },
      xPoweredBy: false,
    })
  )
}

app.disable('x-powered-by')

/* =========================
   Performance: Compression
========================= */
app.use(compression())

/* =========================
   Logger: Optimized for Shared Hosting
   (Short format in prod to save Disk I/O)
========================= */
app.use(
  morgan(isProduction ? 'short' : 'combined', {
    skip: (req, res) => isProduction && res.statusCode < 400, // Optional: Sirf errors/slow requests log karein prod mein (agar aur fast chahiye)
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
)

/* =========================
   Body Parsers
========================= */
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

/* =========================
   CORS
========================= */
if (!isProduction) {
  app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true }))
} else {
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin) return callback(null, true)
        const allowed = (
          process.env.FRONTEND_URLS || 'https://www.zaincode.io,https://zaincode.io'
        ).split(',')
        if (allowed.map((u) => u.trim()).includes(origin)) {
          return callback(null, true)
        }
        callback(new Error('Not allowed by CORS'))
      },
      credentials: true,
    })
  )
}

/* =========================
   Rate Limiting (API only)
========================= */
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
  })
)

/* =========================
   WWW Redirect (Production)
========================= */
app.use((req, res, next) => {
  if (isProduction && req.hostname === 'zaincode.io') {
    return res.redirect(301, `https://www.zaincode.io${req.url}`)
  }
  next()
})

/* =========================
   Static Uploads (With Caching)
========================= */
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    maxAge: '30d', // Browser 30 days tak cache karega
    immutable: true,
  })
)

/* =========================
   API Routes
========================= */
app.use('/api', adminRoute)
app.use('/api', projectsRoute)
app.use('/api', aboutRoute)
app.use('/api', skillsRoute)
app.use('/api', educationRoute)
app.use('/api', testiRoute)
app.use('/api', pricePlanRoute)
app.use('/api', siteSettingsRoute)
app.use('/api', contactMsgRoute)
app.use('/api', expRoute)
app.use('/api', serviceRoute)
app.use('/api', faqsRoute)
app.use('/api', activitiesRoute)
app.use('/api', visitorsRoute)

/* =========================
   Health Check
========================= */
app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

/* =========================
   Frontend Serve (PROD Optimized)
========================= */
if (isProduction) {
  const clientBuildPath = path.join(__dirname, 'client', 'dist')

  app.use(
    express.static(clientBuildPath, {
      maxAge: '1y', // Assets (JS/CSS/Images) ko 1 saal cache karein
      immutable: true,
      setHeaders: (res, filePath) => {
        // HTML file ko kabhi cache na karein taake naye updates foran dikhein
        if (path.extname(filePath) === '.html') {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        }
      },
    })
  )

  // SPA fallback (Sirf non-API routes ke liye)
  app.get(/^(.*)$/, (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) return next()
    res.sendFile(path.join(clientBuildPath, 'index.html'))
  })
}

/* =========================
   API 404
========================= */
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' })
})

/* =========================
   Global Error Handler
========================= */
app.use(errorHandler)

export default app
