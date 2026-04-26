import { Router } from "express";
import { SecureRoute } from "../middlewares/SecureRoute.js";
import {
  addService,
  deleteServices,
  getServices,
  handleValidationErrors,
  serviceValidations,
} from "../Controllers/services.controller.js";
import upload from "../Utils/multer.js";
const r = Router();

// Add Services
r.post(
  "/service/add",
  SecureRoute,
  upload.single("serviceImage"),
  serviceValidations,
  handleValidationErrors,
  addService,
);

// GET Service
r.get("/service/get", getServices);

// DELETE Service
r.delete("/service/delete/:id", SecureRoute, deleteServices);

export default r;
