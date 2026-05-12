import dotenv from 'dotenv';
dotenv.config();

import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import logger from './Utils/logger.js';
import errorHandler from './middlewares/errorHandler.js';

// Routes
import aboutRoute from './Routes/about.route.js';
import adminRoute from './Routes/admin.route.js';
import contactMsgRoute from './Routes/contactMsg.route.js';
import educationRoute from './Routes/education.route.js';
import expRoute from './Routes/experience.route.js';
import faqsRoute from './Routes/faqs.route.js';
import pricePlanRoute from './Routes/pricePlan.route.js';
import projectsRoute from './Routes/projects.route.js';
import activitiesRoute from './Routes/recentActivities.route.js';
import serviceRoute from './Routes/services.route.js';
import siteSettingsRoute from './Routes/siteSettings.route.js';
import skillsRoute from './Routes/skills.route.js';
import testiRoute from './Routes/testimonials.route.js';
import visitorsRoute from './Routes/visitors.route.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';

/* =========================
   Trust Proxy (Hostinger)
========================= */
app.set('trust proxy', isProduction ? 1 : 0);

/* =========================
   Security: Helmet (Environment-Based)
========================= */
if (!isProduction) {
  // 🛠️ Development: Relaxed security for debugging
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false, // ✅ Iframe/Hot reload ke liye
      crossOriginOpenerPolicy: false, // ✅ CORS testing ke liye
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // ✅ Console errors avoid karne ke liye
      originAgentCluster: false,
    })
  );
  console.log('🔓 Helmet: Development mode (relaxed)');
} else {
  // 🔒 Production: Strict security headers
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false, // ✅ Agar iframe/embed use ho raha ho
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'", // ⚠️ Agar inline scripts use ho rahe hain
            'https://*.google.com', // ✅ Analytics/Maps ke liye (agar needed ho)
          ],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:', 'http:'],
          connectSrc: [
            "'self'",
            'https://www.zaincode.io',
            'https://zaincode.io',
            'https://api.zaincode.io', // Agar alag API domain ho
          ],
          frameSrc: ["'self'", 'https://www.youtube.com'], // ✅ Embeds ke liye
        },
      },
      strictTransportSecurity: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      xPoweredBy: false,
    })
  );
  console.log('🔐 Helmet: Production mode (strict)');
}

// ✅ X-Powered-By disable (extra security)
app.disable('x-powered-by');

/* =========================
   Performance
========================= */
app.use(compression());

/* =========================
   Logger
========================= */
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

/* =========================
   Body Parsers
========================= */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

/* =========================
   CORS (DEV ONLY)
========================= */

if (!isProduction) {
  app.use(
    cors({
      origin: ['http://localhost:5173'],
      credentials: true,
    })
  );
} else {
  app.use(
    cors({
      origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl)
        if (!origin) return callback(null, true);

        if (process.env.FRONTEND_URLS.split(',').includes(origin)) {
          return callback(null, true);
        } else {
          return callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    })
  );
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
);

/* =========================
    Allow Images For Cross Browser
============================*/
app.use((req, res, next) => {
  // ✅ Sirf production mein redirect karein
  if (isProduction && req.hostname === 'zaincode.io') {
    return res.redirect(301, `https://www.zaincode.io${req.url}`);
  }
  next();
});

/* =========================
   Static Uploads
========================= */
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* =========================
   API Routes
========================= */
app.use('/api', adminRoute);
app.use('/api', projectsRoute);
app.use('/api', aboutRoute);
app.use('/api', skillsRoute);
app.use('/api', educationRoute);
app.use('/api', testiRoute);
app.use('/api', pricePlanRoute);
app.use('/api', siteSettingsRoute);
app.use('/api', contactMsgRoute);
app.use('/api', expRoute);
app.use('/api', serviceRoute);
app.use('/api', faqsRoute);
app.use('/api', activitiesRoute);
app.use('/api', visitorsRoute);

/* =========================
   Health Check (Hostinger)
========================= */
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

/* =========================
   Frontend Serve (PROD)
========================= */
if (isProduction) {
  const clientBuildPath = path.join(__dirname, 'client', 'dist');

  app.use(express.static(clientBuildPath));

  // SPA fallback (only non-API routes)
  app.get(/^(.*)$/, (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

/* =========================
   API 404
========================= */
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

/* =========================
   Global Error Handler
========================= */
app.use(errorHandler);

export default app;
