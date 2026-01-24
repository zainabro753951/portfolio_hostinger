import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";

import logger from "./Utils/logger.js";
import errorHandler from "./middlewares/errorHandler.js";

// Routes
import adminRoute from "./Routes/admin.route.js";
import projectsRoute from "./Routes/projects.route.js";
import aboutRoute from "./Routes/about.route.js";
import skillsRoute from "./Routes/skills.route.js";
import educationRoute from "./Routes/education.route.js";
import testiRoute from "./Routes/testimonials.route.js";
import pricePlanRoute from "./Routes/pricePlan.route.js";
import siteSettingsRoute from "./Routes/siteSettings.route.js";
import contactMsgRoute from "./Routes/contactMsg.route.js";
import expRoute from "./Routes/experience.route.js";
import serviceRoute from "./Routes/services.route.js";
import faqsRoute from "./Routes/faqs.route.js";
import activitiesRoute from "./Routes/recentActivities.route.js";
import visitorsRoute from "./Routes/visitors.route.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === "production";

/* =========================
   Trust Proxy (Hostinger)
========================= */
app.set("trust proxy", isProduction ? 1 : 0);

/* =========================
   Security
========================= */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  }),
);
app.disable("x-powered-by");

/* =========================
   Performance
========================= */
app.use(compression());

/* =========================
   Logger
========================= */
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }),
);

/* =========================
   Body Parsers
========================= */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

/* =========================
   CORS (DEV ONLY)
========================= */
if (!isProduction) {
  app.use(
    cors({
      origin: ["http://localhost:5173"],
      credentials: true,
    }),
  );
}

/* =========================
   Rate Limiting (API only)
========================= */
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

/* =========================
   Static Uploads
========================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   API Routes
========================= */
app.use("/api", adminRoute);
app.use("/api", projectsRoute);
app.use("/api", aboutRoute);
app.use("/api", skillsRoute);
app.use("/api", educationRoute);
app.use("/api", testiRoute);
app.use("/api", pricePlanRoute);
app.use("/api", siteSettingsRoute);
app.use("/api", contactMsgRoute);
app.use("/api", expRoute);
app.use("/api", serviceRoute);
app.use("/api", faqsRoute);
app.use("/api", activitiesRoute);
app.use("/api", visitorsRoute);

/* =========================
   Health Check (Hostinger)
========================= */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/* =========================
   Frontend Serve (PROD)
========================= */
if (isProduction) {
  const clientBuildPath = path.join(__dirname, "client", "dist");

  app.use(express.static(clientBuildPath));

  // SPA fallback (only non-API routes)
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

/* =========================
   API 404
========================= */
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

/* =========================
   Global Error Handler
========================= */
app.use(errorHandler);

export default app;
